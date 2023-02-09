/*
 * Copyright (c) 2017-present “Neo4j, Inc.” [http://neotechnology.com]
 *
 * This file is part of Neo4j Solutions Accelerators.
 * Neo4j accelerator frameworks and use case based starter kits are Neo4j IP: you cannot redistribute it
 * and they fall under the terms of the Neo4j Partner Agreement as negotiated by
 * Neo4j, Inc. and its Partners.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * You are requested to contribute any modifications back to the Neo4j Solutions Team at solutions@neo4j.com
 *
 * For questions reach our to Neo4j Solutions Team - solutions@neo4j.com
 * https://github.com/Neo4jSolutions
 */

export const getDynamicConfigValue = (envKey) => {
  let value = null;
  if (window._dynamicEnv_) {
    value = window._dynamicEnv_[envKey];
  }
  if (!value) {
    value = process.env[envKey];
  }
  return value;
};

// shortcut with REACT_APP_ prefix
export const config = (envKey) => getDynamicConfigValue(`REACT_APP_${envKey}`);
