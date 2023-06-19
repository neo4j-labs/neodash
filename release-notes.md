## NeoDash 2.3.0
NeoDash 2.3 is out! This release brings a brand new look-and-feel, improved speed for large dashboards, and a new extension for querying Neo4j with natural language (using LLMs).

Key features:
- Write **[Natural Language Queries](link)** and use OpenAI to generate Cypher queries for your visualizations.
- UI updated to use the **[Neo4j Design Language](link)**, giving NeoDash a similar look-and-feel to other Neo4j tools.
- Customize branding, colors dynamically with a new [style configuration file](link).
  
Others:
- Fixed issues with date picker / free-text parameter sometimes not working correctly.
- Improved documentation by fixing broken links, and adding more details around complex concepts. (@Pierre & others)
- **'Pro Extensions' have evolved to open-source 'Expert Extensions'.**
- Fixed issue where parameters were not set from the URL.
- Added option to specify absolute width for table columns (in pixels) @8Rav3n
- Fixed map charts to auto-cluster markers when they collide, or are too close together.