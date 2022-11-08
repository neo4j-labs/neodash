## Setting up the gallery back-end

The NeoDash gallery is powered by a Neo4j Aura Enterprise instance, available at `acb5b6ae.databases.neo4j.io`.
A set 

### Create a read-only user to list dashboards.

```
:use system;

CREATE USER gallery SET PASSWORD 'gallery' CHANGE NOT REQUIRED;
CREATE ROLE gallery;
GRANT ROLE gallery TO gallery;
GRANT ACCESS ON DATABASE neo4j TO `gallery`;
GRANT MATCH {*} ON GRAPH neo4j NODE `_Neodash_Dashboard` TO gallery;
```

### Create read-only users for each of the use-cases.
Bill of Materials:
```
:use system;

CREATE USER bom SET PASSWORD 'bom' CHANGE NOT REQUIRED;
CREATE ROLE bom;
GRANT ROLE bom TO bom;
GRANT ACCESS ON DATABASE neo4j TO `bom`;

GRANT MATCH {*} ON GRAPH neo4j NODE Component TO `bom`;
GRANT MATCH {*} ON GRAPH neo4j NODE Model TO `bom`;
GRANT MATCH {*} ON GRAPH neo4j NODE Supplier TO `bom`;
GRANT MATCH {*} ON GRAPH neo4j RELATIONSHIP HAS TO `bom`;
GRANT MATCH {*} ON GRAPH neo4j RELATIONSHIP SUPPLIED_BY TO `bom`;
GRANT MATCH {*} ON GRAPH neo4j RELATIONSHIP SIMILAR TO `bom`;
```

Graph Assessment:
```
:use system;

CREATE USER assessment SET PASSWORD 'assessment' CHANGE NOT REQUIRED;
CREATE ROLE assessment;
GRANT ROLE assessment TO assessment;
GRANT ACCESS ON DATABASE neo4j TO `assessment`;

GRANT MATCH {*} ON GRAPH neo4j NODE GraphAssessment TO `assessment`;
GRANT MATCH {*} ON GRAPH neo4j NODE Pillar TO `assessment`;
GRANT MATCH {*} ON GRAPH neo4j NODE Topic TO `assessment`;
GRANT MATCH {*} ON GRAPH neo4j NODE Person TO `assessment`;
GRANT MATCH {*} ON GRAPH neo4j NODE ProjectAssessment TO `assessment`;
GRANT MATCH {*} ON GRAPH neo4j NODE Customer TO `assessment`;
GRANT MATCH {*} ON GRAPH neo4j NODE Project TO `assessment`;
GRANT MATCH {*} ON GRAPH neo4j NODE Model TO `assessment`;
GRANT MATCH {*} ON GRAPH neo4j NODE Component TO `assessment`;

GRANT MATCH {*} ON GRAPH neo4j RELATIONSHIP CONSISTS_OF TO `assessment`;
GRANT MATCH {*} ON GRAPH neo4j RELATIONSHIP CONTAINS TO `assessment`;
GRANT MATCH {*} ON GRAPH neo4j RELATIONSHIP ASSESSED TO `assessment`;
GRANT MATCH {*} ON GRAPH neo4j RELATIONSHIP COMPLETED TO `assessment`;
GRANT MATCH {*} ON GRAPH neo4j RELATIONSHIP EMPLOYEES TO `assessment`;
GRANT MATCH {*} ON GRAPH neo4j RELATIONSHIP MEMBEROF TO `assessment`;
GRANT MATCH {*} ON GRAPH neo4j RELATIONSHIP ASSOCIATED TO `assessment`;
GRANT MATCH {*} ON GRAPH neo4j RELATIONSHIP HAS TO `assessment`;
```

Domain Names:
```
:use system;

CREATE USER domains SET PASSWORD 'domains' CHANGE NOT REQUIRED;
CREATE ROLE domains;
GRANT ROLE domains TO domains;
GRANT ACCESS ON DATABASE neo4j TO `domains`;

GRANT MATCH {*} ON GRAPH neo4j NODE DNS TO `domains`;
GRANT MATCH {*} ON GRAPH neo4j NODE Site TO `domains`;
GRANT MATCH {*} ON GRAPH neo4j NODE Gestionnaires TO `domains`;
GRANT MATCH {*} ON GRAPH neo4j NODE Beneficiaires TO `domains`;
GRANT MATCH {*} ON GRAPH neo4j RELATIONSHIP HEBERGESUR TO `domains`;
GRANT MATCH {*} ON GRAPH neo4j RELATIONSHIP GERE TO `domains`;
GRANT MATCH {*} ON GRAPH neo4j RELATIONSHIP CLIENTDE TO `domains`;
GRANT MATCH {*} ON GRAPH neo4j RELATIONSHIP POSSEDE TO `domains`;


```

Bitcoin:
```
:use system;

CREATE USER bitcoin SET PASSWORD 'bitcoin' CHANGE NOT REQUIRED;
CREATE ROLE bitcoin;
GRANT ROLE bitcoin TO bitcoin;
GRANT ACCESS ON DATABASE neo4j TO `bitcoin`;
```