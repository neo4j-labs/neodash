```
MATCH (:Dominion {name: $neodash_dominion_name})<-[:hasParent]-{0,3}(:Dominion)--(af:AttackFinding)-[:place]-(p:Place)
MATCH (a:Attack)--(af)
WITH a, p, af, 
     point({latitude: p.georef_other.y, longitude: p.georef_other.x}) AS placePoint
WHERE spatial.withinPolygon(
    placePoint,
    $polygonVertices
)
RETURN {id: a.system_id, label: a.date, title:COALESCE(a.title,""), point: COALESCE(p.georef_other,p.gazetteer_uri), place:p.name}
```

This query uses the global dashboard state polygon vertices to only show attacks within the polygon drawn on the same dashboard
by MapChartPolygonDrawable.tsx (Available as  Report.)

It requires `spatial-algorithms` to be installed and likely needs work to default to including all items before the first polygon is drawn.