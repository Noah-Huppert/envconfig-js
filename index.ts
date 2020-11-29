/**
 * Type of an environment configuration property definition. Items are:
 * 
 *     [env var name, type, default]
 *
 * The type can be "string" or "number". Default is optional.
 */
export type EnvConfigPropDef = [string, string, any?];

/**
 * Object which defines the structure of a resulting environment variable configuration 
 * object. This will be processed by the EnvConfig function. Values can be recursive 
 * EnvConfigDefs or a property definition.
 */
export type EnvConfigDef = {[index: string]: EnvConfigDef | EnvConfigPropDef};

/**
 * Creates a configuration object with values from environment variables. The structure and
 * keys of the resulting configuration object will be the same the def argument's. The 
 * values of these keys will be determined by the EnvConfigPropDef.
 * @param prefix Prefix to prepend to every environment variable name in the def argument.
 *     If you don't want any prefix just pass an empty string.
 * @param def Definition of resulting configuration object. Keys names are preserved in
 *     the returned object. Values are tuples defining which environment variables to
 *     get get values from, and how to process them.
 * @throws {string} If an error occurrs parsing the configuration.
 */
export default function EnvConfig(prefix: string, def: EnvConfigDef) {
    let missingEnvs = new Set();

    function resolve(def: EnvConfigDef): object {
        return objMap(def, (k: string, v: any): any => {
            // If we need to call recursively
            if (Array.isArray(v) === false) {
                return resolve(v);
            }

            // Otherwise process as tuple definition
            const envKey = prefix + v[0];
            const envType = v[1];
            
            let envValue: any = process.env[envKey];
            if (envValue === undefined) {
                // Use defined default value
                if (v.length === 3) {
                    envValue = v[2];
                } else {
                    // If no default value record as missing
                    missingEnvs.add(envKey);
                    return undefined;
                }
            }

            try {
                switch (envType) {
                    case "string":
                        envValue = envValue.toString();
                        break;
                    case "integer":
                        envValue = parseInt(envValue);
                        break;
                    default:
                        throw `Unknown type in definition, the type "${envType}" is not valid`;
                }
            } catch (e) {
                throw `Failed to cast configuration key "${k}" (Environment variable "${envKey}"): ${e}`;
            }

            return envValue;
        });
    }

    let config = resolve(def);

    if (missingEnvs.size > 0) {
        throw `Missing environment variable(s): ${Array.from(missingEnvs).join(", ")}`;
    }

    return config;
}
