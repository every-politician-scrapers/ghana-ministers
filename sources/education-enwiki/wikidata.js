const fs = require('fs');
let rawmeta = fs.readFileSync('meta.json');
let meta = JSON.parse(rawmeta);

module.exports = function () {
  let datefilter = meta.start ? `FILTER (!BOUND(?startV) || (?startV >= "${meta.start}T00:00:00Z"^^xsd:dateTime))` : '';

  return `SELECT DISTINCT ?item ?itemLabel ?startDate ?endDate ?sourceDate
               (STRAFTER(STR(?held), '/statement/') AS ?psid)
        WHERE {
          ?item wdt:P31 wd:Q5 ; p:P39 ?held .
          ?held ps:P39 wd:${meta.position} .
          FILTER NOT EXISTS { ?held wikibase:rank wikibase:DeprecatedRank }

          {
            ?held pqv:P580 [ wikibase:timeValue ?startV ; wikibase:timePrecision ?startP ]
            BIND(COALESCE(
              IF(?startP = 11, SUBSTR(STR(?startV), 1, 10), 1/0),
              IF(?startP = 10, SUBSTR(STR(?startV), 1, 7), 1/0),
              IF(?startP = 9,  SUBSTR(STR(?startV), 1, 4), 1/0),
              IF(?startP = 8,  CONCAT(SUBSTR(STR(?startV), 1, 4), "s"), 1/0),
              ""
            ) AS ?startDate)
          }
          OPTIONAL {
            ?held pqv:P582 [ wikibase:timeValue ?endV ; wikibase:timePrecision ?endP ]
            BIND(COALESCE(
              IF(?endP = 11, SUBSTR(STR(?endV), 1, 10), 1/0),
              IF(?endP = 10, SUBSTR(STR(?endV), 1, 7), 1/0),
              IF(?endP = 9,  SUBSTR(STR(?endV), 1, 4), 1/0),
              IF(?endP = 8,  CONCAT(SUBSTR(STR(?endV), 1, 4), "s"), 1/0),
              ""
            ) AS ?endDate)
          }
          ${datefilter}

          OPTIONAL {
            ?held prov:wasDerivedFrom ?ref .
            ?ref pr:P4656 ?source FILTER CONTAINS(STR(?source), '${meta.source}') .
            OPTIONAL { ?ref pr:P1810 ?sourceName }
            OPTIONAL { ?ref pr:P813  ?sourceDate }
          }
          OPTIONAL { ?item rdfs:label ?wdLabel FILTER(LANG(?wdLabel) = "${meta.lang}") }
          BIND(COALESCE(?sourceName, ?wdLabel) AS ?itemLabel)
        }
        # ${new Date().toISOString()}
        ORDER BY ?startDate ?itemLabel ?psid ?sourceDate`
}
