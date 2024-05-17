import { useContext } from 'react'
import { Neo4jContext } from '.'
import { Neo4jScheme } from './neo4j-config.interface'

export const useConnection = (scheme: Neo4jScheme, host: string, port: string | number, username: string, password: string) => {
    const context = useContext(Neo4jContext)

    context.updateConnection({
        scheme,
        host,
        port,
        username,
        password,
    })
}
