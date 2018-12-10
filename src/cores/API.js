const QUERY_START = 'query='
const REMOTE_END_POINT = 'https://m1.profium.com/servlet/QueryServlet?'
const IMAGE = '<http://www.profium.com/archive/Image>'
const DEPICTED_OBJ = '<http://www.profium.com/archive/depictedObject>'
const DEPICTED_OBJ_INV = '<http://www.profium.com/archive/depictedObjectInverse>'
const DISPLAY_URL_START = 'https://m1.profium.com/displayContent.do?uri='
const FETCH_ALL = `SELECT ?p ?label (COUNT(?s) AS ?COUNT) WHERE { {?s ?p ?o FILTER REGEX(STR(?p), "http://www.profium.com/city/") . ?p rdfs:label ?label FILTER LANGMATCHES( LANG(?label), "fi" ) . ?s <http://www.profium.com/archive/depictedObjectInverse> ?objectInverse} UNION { ?s ?p ?o FILTER REGEX(STR(?p),  "http://www.profium.com/tuomi") . ?p rdfs:label ?label FILTER LANGMATCHES( LANG(?label), "fi" ) . ?s <http://www.profium.com/archive/depictedObjectInverse> ?objectInverse} UNION { ?s ?p ?o FILTER REGEX(STR(?p), "http://www.profium.com/tuomitos") . ?p rdfs:label ?label FILTER LANGMATCHES( LANG(?label), "fi" ) . ?s <http://www.profium.com/archive/depictedObjectInverse> ?objectInverse} }  GROUP BY ?p ?label`
const IMG_TYPE_THUMB = '&type=thumb'
const IMG_TYPE_LARGE_THUMB = '&type=largeThumb'
const IMG_TYPE_NORMAL = '&type=normal'

const IMAGE_DEPIC_COND = `?img a ${IMAGE} . ?img ${DEPICTED_OBJ} ?depic`
var DomParser = require('react-native-html-parser').DOMParser
const parser = new DomParser()

export default API = {

  query: async function(config) {

    const request = REMOTE_END_POINT
    const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `${QUERY_START}${config.query}`
    }
    const res = await fetch(request, options)
    const resText = await res.text()
    const json = this.xml2json(resText, " ")
    return json 
  },


  fetchAll : async function()  {
    const config = {
      query: FETCH_ALL
    }
    const res = await this.query(config)
    const output = this.handleFetchAllData(res)
    return output
  },

  handleFetchAllData: function(json) {
    let rawJSON = JSON.parse(json)
    let resultArray = []
    resultArray = rawJSON.sparql.results.result
    let parsedResponse = []
    resultArray.forEach(element => {
        let tmp = {
            predicate: element.binding[0].uri,
            label: element.binding[1].literal['#text'],
            count: element.binding[2].literal['#text']
        }
        parsedResponse.push(tmp)
    })
    return JSON.parse(JSON.stringify(parsedResponse))
},

  getPredicatedObjects: async function(predicate){
    const GET_PREDICATED_OBJ = 'SELECT ?o (COUNT(?s) AS ?COUNT) WHERE { ?s <' + predicate + '> ?o FILTER regex(STR(?s), "http://www.profium.com/archive/")} GROUP BY ?o'
    const config = {
      query: GET_PREDICATED_OBJ
    }
    const res = await this.query(config)
    const output = this.handlePredicatedObjectData(res)
    return(output)
  },

  handlePredicatedObjectData: function(json) {
    let rawJSON = JSON.parse(json)
    let resultArray = rawJSON.sparql.results.result
    let parsedResponse = []
    if (resultArray instanceof Array) {
        resultArray.forEach(element => {
            let tmp = {
                date: element.binding[0].literal? element.binding[0].literal['#text'] : element.binding[0].uri.split('#')[1],
                count: element.binding[1].literal['#text']
            }
            parsedResponse.push(tmp)
        })
    } else {
        let tmp = {
            date: resultArray.binding[0].literal? resultArray.binding[0].literal['#text'] : resultArray.binding[0].uri.split('#')[1],
            count: resultArray.binding[1].literal['#text']
        }
        parsedResponse.push(tmp)
    }
    return JSON.parse(JSON.stringify(parsedResponse))
  },

  getInversePredicatedObjects: async function(predicate) {
    const GET_INVERESE_PREDICATED_OBJ = 'SELECT DISTINCT ?objectInverse WHERE { ?s <' + predicate + '> ?o . ?s <http://www.profium.com/archive/depictedObjectInverse> ?objectInverse FILTER REGEX(STR(?s), "http://www.profium.com/archive/") }'
    const config = {
      query: GET_INVERESE_PREDICATED_OBJ
    }
    const res = await this.query(config)
    const output = this.handleInversePredicatedObjectData(res)
    return output
  },

  handleInversePredicatedObjectData(data) {
    let rawJSON = JSON.parse(data)
    let resultArray = rawJSON.sparql.results.result
    let parsedResponse = []
    resultArray.forEach(element => {
        let tmp = {
            objectInverse: element.binding.uri
        }
        parsedResponse.push(tmp)
    })
    return JSON.parse(JSON.stringify(parsedResponse))
},

  xml2json: function(xml, tab) {
    xml = parser.parseFromString(xml, "text/xml")
    var X = {
        toObj: function (xml) {
            var o = {}
            if (xml.nodeType == 1) {   // element node ..
                if (xml.attributes.length)   // element with attributes  ..
                    for (var i = 0; i < xml.attributes.length; i++)
                        o["@" + xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue || "").toString()
                if (xml.firstChild) { // element has child nodes ..
                    var textChild = 0, cdataChild = 0, hasElementChild = false
                    for (var n = xml.firstChild; n; n = n.nextSibling) {
                        if (n.nodeType == 1) hasElementChild = true
                        else if (n.nodeType == 3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++ // non-whitespace text
                        else if (n.nodeType == 4) cdataChild++ // cdata section node
                    }
                    if (hasElementChild) {
                        if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                            X.removeWhite(xml)
                            for (var n = xml.firstChild; n; n = n.nextSibling) {
                                if (n.nodeType == 3)  // text node
                                    o["#text"] = X.escape(n.nodeValue)
                                else if (n.nodeType == 4)  // cdata node
                                    o["#cdata"] = X.escape(n.nodeValue)
                                else if (o[n.nodeName]) {  // multiple occurence of element ..
                                    if (o[n.nodeName] instanceof Array)
                                        o[n.nodeName][o[n.nodeName].length] = X.toObj(n)
                                    else
                                        o[n.nodeName] = [o[n.nodeName], X.toObj(n)]
                                }
                                else  // first occurence of element..
                                    o[n.nodeName] = X.toObj(n)
                            }
                        }
                        else { // mixed content
                            if (!xml.attributes.length)
                                o = X.escape(X.innerXml(xml))
                            else
                                o["#text"] = X.escape(X.innerXml(xml))
                        }
                    }
                    else if (textChild) { // pure text
                        if (!xml.attributes.length)
                            o = X.escape(X.innerXml(xml))
                        else
                            o["#text"] = X.escape(X.innerXml(xml))
                    }
                    else if (cdataChild) { // cdata
                        if (cdataChild > 1)
                            o = X.escape(X.innerXml(xml))
                        else
                            for (var n = xml.firstChild; n; n = n.nextSibling)
                                o["#cdata"] = X.escape(n.nodeValue)
                    }
                }
                if (!xml.attributes.length && !xml.firstChild) o = null
            }
            else if (xml.nodeType == 9) { // document.node
                o = X.toObj(xml.documentElement)
            }
            else
                alert("unhandled node type: " + xml.nodeType)
            return o
        },
        toJson: function (o, name, ind) {
            var json = name ? ("\"" + name + "\"") : ""
            if (o instanceof Array) {
                for (var i = 0, n = o.length; i < n; i++)
                    o[i] = X.toJson(o[i], "", ind + "\t")
                json += (name ? ":[" : "[") + (o.length > 1 ? ("\n" + ind + "\t" + o.join(",\n" + ind + "\t") + "\n" + ind) : o.join("")) + "]"
            }
            else if (o == null)
                json += (name && ":") + "null"
            else if (typeof(o) == "object") {
                var arr = []
                for (var m in o)
                    arr[arr.length] = X.toJson(o[m], m, ind + "\t")
                json += (name ? ":{" : "{") + (arr.length > 1 ? ("\n" + ind + "\t" + arr.join(",\n" + ind + "\t") + "\n" + ind) : arr.join("")) + "}"
            }
            else if (typeof(o) == "string")
                json += (name && ":") + "\"" + o.toString() + "\""
            else
                json += (name && ":") + o.toString()
            return json
        },
        innerXml: function (node) {
            var s = ""
            if ("innerHTML" in node)
                s = node.innerHTML
            else {
                var asXml = function (n) {
                    var s = ""
                    if (n.nodeType == 1) {
                        s += "<" + n.nodeName
                        for (var i = 0; i < n.attributes.length; i++)
                            s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue || "").toString() + "\""
                        if (n.firstChild) {
                            s += ">"
                            for (var c = n.firstChild; c; c = c.nextSibling)
                                s += asXml(c)
                            s += "</" + n.nodeName + ">"
                        }
                        else
                            s += "/>"
                    }
                    else if (n.nodeType == 3)
                        s += n.nodeValue
                    else if (n.nodeType == 4)
                        s += "<![CDATA[" + n.nodeValue + "]]>"
                    return s
                }
                for (var c = node.firstChild; c; c = c.nextSibling)
                    s += asXml(c)
            }
            return s
        },
        escape: function (txt) {
            return txt.replace(/[\\]/g, "\\\\")
                .replace(/[\"]/g, '\\"')
                .replace(/[\n]/g, '\\n')
                .replace(/[\r]/g, '\\r')
        },
        removeWhite: function (e) {
            e.normalize()
            for (var n = e.firstChild; n;) {
                if (n.nodeType == 3) {  // text node
                    if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                        var nxt = n.nextSibling
                        e.removeChild(n)
                        n = nxt
                    }
                    else
                        n = n.nextSibling
                }
                else if (n.nodeType == 1) {  // element node
                    X.removeWhite(n)
                    n = n.nextSibling
                }
                else                      // any other node
                    n = n.nextSibling
            }
            return e
        }
    }
    if (xml.nodeType == 9) // document node
        xml = xml.documentElement
    var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t")
    return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}"
  },

  getLargeThumbnailImage: function(imageUrl) {
  
    return `${DISPLAY_URL_START}${imageUrl}${IMG_TYPE_LARGE_THUMB}`
  },

  getNormalImage: function(imageUrl) {

    return `${DISPLAY_URL_START}${imageUrl}${IMG_TYPE_NORMAL}`
  }

}
