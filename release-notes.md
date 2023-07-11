## NeoDash 2.3.0
NeoDash 2.3 is out! This release brings a brand new look-and-feel, improved speed for large dashboards, and a new extension for querying Neo4j with natural language (using LLMs).

Highlights:
- Write **[Natural Language Queries](https://neo4j.com/labs/neodash/2.3/user-guide/extensions/natural-language-queries/)** and use OpenAI to generate Cypher queries for your visualizations. (OpenAI API key required)
- UI updated to use the **[Neo4j Design Language](https://www.neo4j.design/)**, giving NeoDash a similar look-and-feel to other Neo4j tools.
- Customize branding, colors dynamically with a new [Style Configuration File](https://neo4j.com/labs/neodash/2.3/developer-guide/style-configuration).
  
Others:
- Fixed issues with date picker / free-text parameter sometimes not working correctly.
- Improved documentation by fixing broken links, and adding more details around complex concepts. 
- *'Pro Extensions' have evolved to open 'Expert Extensions'.*
- Fixed issue where parameters were not set from the URL.
- Added option to specify absolute width for table columns (in pixels)/
- Fixed map charts to auto-cluster markers when they collide, or are too close together.
- Improved performance for large dashboards by reducing the amount of re-renders.
- Added new tools for code analysis, error logging to improve long term code quality.