import xml2js from 'react-native-xml2js'
const parseXml = xml2js.parseString


const QUERY_START = 'query='
const REMOTE_END_POINT = 'https://m1.profium.com/servlet/QueryServlet?'
const IMAGE = '<http://www.profium.com/archive/Image>'
const DEPICTED_OBJ = '<http://www.profium.com/archive/depictedObject>'
const DEPICTED_OBJ_INV = '<http://www.profium.com/archive/depictedObjectInverse>'
const THUMBNAIL_URL = '<http://www.profium.com/imagearchive/2007/thumbnail>' // what's in /contract-archive ??
const LARGE_THUMBNAIL_URL = '<http://www.profium.com/imagearchive/2007/largeThumbnail>'
const NORMAL_IMAGE_URL = '<http://www.profium.com/imagearchive/2007/normal>'
const DISPLAY_URL_START = 'https://m1.profium.com/displayContent.do?uri='

const IMG_TYPE_THUMB = '&type=thumb'
const IMG_TYPE_LARGE_THUMB = '&type=largeThumb'
const IMG_TYPE_NORMAL = '&type=normal'

const DOC_SPECIFIER = '<http://www.profium.com/tuomi/asiakirjatyypinTarkenne>'

const IMAGE_DEPIC_COND = `?img a ${IMAGE} . ?img ${DEPICTED_OBJ} ?depic`

const GET_ALL_TOP_LVL_PROPS = `SELECT DISTINCT ?prop WHERE { ${IMAGE_DEPIC_COND} . ?depic ${DOC_SPECIFIER} ?prop }`

export default API = {

  query: function(config, useUri) {

    const request = REMOTE_END_POINT
    const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `${QUERY_START}${config.query}`
    }
    return fetch(request, options)
    .then(response => response.text())
    .then(responseText => { 

      const xml = responseText
      let resultsSet = new Set()
      parseXml(xml, function (err, result) {
        const results = result.sparql.results[0].result
        if (results !== undefined && results !== null) { 

          results.map(item => {
            if (useUri === true) {
              resultsSet.add(item.binding[0].uri[0])
            } else {     
              resultsSet.add(item.binding[0].literal[0]._)
            }
          }) 
        } 
      })
      return resultsSet
    })
    .catch(error => console.error(error))
  },

  getTopLevelImageProps: function() {
    
    const config = {
      query: GET_ALL_TOP_LVL_PROPS
    }
    return this.query(config, false)
  },

  getImageUrls: function(chosenProp) {

    const GET_URLS_BASED_ON_PROP = `SELECT DISTINCT ?url WHERE { ${IMAGE_DEPIC_COND} . ?depic ${DOC_SPECIFIER} '${chosenProp}' 
    . ?depic ${DEPICTED_OBJ_INV} ?url }`

    const config = {
      query: GET_URLS_BASED_ON_PROP
    }
    return this.query(config, true)
  },

  getLargeThumbnailImage: function(imageUrl) {
  
    return `${DISPLAY_URL_START}${imageUrl}${IMG_TYPE_LARGE_THUMB}`
  },

  getNormalImage: function(imageUrl) {

    return `${DISPLAY_URL_START}${imageUrl}${IMG_TYPE_NORMAL}`
  }

}
