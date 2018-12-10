const backendURL = 'https://m1.profium.com/servlet/QueryServlet'
const imageBackendURL = 'https://m1.profium.com/displayContent.do'
const query = encodeURI('?query=SELECT ?p ?label (COUNT(?s) AS ?COUNT) WHERE { {?s ?p ?o FILTER REGEX(STR(?p), "http://www.profium.com/city/") . ?p rdfs:label ?label FILTER LANGMATCHES( LANG(?label), "fi" ) . ?s <http://www.profium.com/archive/depictedObjectInverse> ?objectInverse} UNION { ?s ?p ?o FILTER REGEX(STR(?p),  "http://www.profium.com/tuomi") . ?p rdfs:label ?label FILTER LANGMATCHES( LANG(?label), "fi" ) . ?s <http://www.profium.com/archive/depictedObjectInverse> ?objectInverse} UNION { ?s ?p ?o FILTER REGEX(STR(?p), "http://www.profium.com/tuomitos") . ?p rdfs:label ?label FILTER LANGMATCHES( LANG(?label), "fi" ) . ?s <http://www.profium.com/archive/depictedObjectInverse> ?objectInverse} }  GROUP BY ?p ?label')
const parser = new DOMParser()


function fetchAll() {
    return new Promise(function (resolve, reject) {
        let jsonResponse = ""
        let xhr = createCORSRequest('GET', backendURL + query)

        xhr.onload = () => {
            // Process our return data
            //console.log(parseResponse(xhr.responseText));
            if (xhr.status >= 200 && xhr.status < 300) {
                // This will run when the request is successful
                jsonResponse = parseResponse(xhr.responseText)
                resolve(jsonResponse)
            } else {
                // This will run when it's not
                console.log('The request failed!')
                //something should happen here
            }
        }
        xhr.send()
    })
}

/*
xhr.onreadystatechange = function(){
  console.log(xhr.readyState)
  console.log(xhr.responseText)
}
*/

//helper functions
function createCORSRequest(method, url) {
    let xhr = new XMLHttpRequest()
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true)
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest()
        xhr.open(method, url)
    } else {
        // CORS not supported.
        xhr = null
    }
    return xhr
}

function parseResponse(responseText) {
    let rawJSONstring = xml2json(responseText, " ")
    let rawJSON = JSON.parse(rawJSONstring)
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
}

function xml2json(xml, tab) {
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
}

function getPredicateObjects(predicate) {
    return new Promise(function (resolve, reject) {
        let jsonResponse = ""
        let query = constructFollowupQuery(predicate)
        let xhr = createCORSRequest('GET', backendURL + query)

        xhr.onload = () => {
            // Process our return data
            //console.log(parseResponse(xhr.responseText));
            if (xhr.status >= 200 && xhr.status < 300) {
                // This will run when the request is successful
                jsonResponse = parseFollowupResponse(xhr.responseText)
                resolve(jsonResponse)
            } else {
                // This will run when it's not
                console.log('The request failed!')
                //something should happen here
            }
        }
        xhr.send()
    })
}

function parseFollowupResponse(responseText) {
    let rawJSONstring = xml2json(responseText, " ")
    let rawJSON = JSON.parse(rawJSONstring)
    console.log(rawJSON)
    let resultArray = rawJSON.sparql.results.result
    let parsedResponse = []
    if (resultArray instanceof Array) {
        resultArray.forEach(element => {
            let tmp = {
                label: element.binding[0].literal? element.binding[0].literal['#text'] : element.binding[0].uri.split('#')[1],
                count: element.binding[1].literal['#text']
            }
            parsedResponse.push(tmp)
        })
    } else {
        console.log(resultArray.binding[0])
        console.log(resultArray.binding[1])

        let tmp = {
            label: resultArray.binding[0].literal? resultArray.binding[0].literal['#text'] : resultArray.binding[0].uri.split('#')[1],
            count: resultArray.binding[1].literal['#text']
        }
        parsedResponse.push(tmp)
    }

    return JSON.parse(JSON.stringify(parsedResponse))
}

function constructFollowupQuery(predicate) {
    return '?query=SELECT ?o (COUNT(?s) AS ?COUNT) WHERE { ?s <' + predicate + '> ?o FILTER regex(STR(?s), "http://www.profium.com/archive/")} GROUP BY ?o'
}

function getInverseObjects(predicate) {
    return new Promise(function (resolve, reject) {
        let jsonResponse = ""
        let query = constructInverseObjectsQuery(predicate)
        let xhr = createCORSRequest('GET', backendURL + query)

        xhr.onload = () => {
            // Process our return data
            // console.log(parseInverseObjectsResponse(xhr.responseText));
            if (xhr.status >= 200 && xhr.status < 300) {
                // This will run when the request is successful
                jsonResponse = parseInverseObjectsResponse(xhr.responseText)
                resolve(jsonResponse)
            } else {
                // This will run when it's not
                console.log('The request failed!')
                //something should happen here
            }
        }
        xhr.send()
    })
}

function constructInverseObjectsQuery(predicate) {
    return '?query=SELECT DISTINCT ?objectInverse WHERE { ?s <' + predicate + '> ?o . ?s <http://www.profium.com/archive/depictedObjectInverse> ?objectInverse FILTER REGEX(STR(?s), "http://www.profium.com/archive/") }'
}

function parseInverseObjectsResponse(responseText) {
    let rawJSONstring = xml2json(responseText, " ")
    let rawJSON = JSON.parse(rawJSONstring)
    let resultArray = rawJSON.sparql.results.result
    let parsedResponse = []
    resultArray.forEach(element => {
        let tmp = {
            objectInverse: element.binding.uri
        }
        parsedResponse.push(tmp)
    })
    return JSON.parse(JSON.stringify(parsedResponse))
}

function getImage(uri, type) {
    return new Promise(function (resolve, reject) {
        let query = constructImageQuery(uri, type)
        let xhr = createCORSRequest('GET', imageBackendURL + query)
        xhr.responseType = 'blob'
        xhr.onload = () => {
            // Process our return data
            if (xhr.status >= 200 && xhr.status < 300) {
                // This will run when the request is successful
                let createdObject = window.URL.createObjectURL(xhr.response)
                resolve(createdObject)
            } else {
                // This will run when it's not
                console.log('The request failed!')
                //something should happen here
            }
        }
        xhr.send()
    })
}

function constructImageQuery(uri, type) {
    return '?uri=' + uri + '&type=' + type
}