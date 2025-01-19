


interface EnvironmentProfile{
    environment: "staging" | "production"
    baseBackendUrl:string;
    baseGridSocketUrl:string;


}
const environments:{[key:string] : EnvironmentProfile} = {

    staging: {
        environment: 'staging',
        baseBackendUrl: process.env.REACT_APP_BASE_BACKEND_URL || "",  
        baseGridSocketUrl: process.env.REACT_APP_BASE_GRID_SOCKET_URL || "",   
    },
    production:{
        environment:'production',
        baseBackendUrl: process.env.REACT_APP_BASE_BACKEND_URL || "",
        baseGridSocketUrl: process.env.REACT_APP_BASE_GRID_SOCKET_URL || ""     
    }          
     
}

const config: EnvironmentProfile = environments?.[process.env.TP_NODE_ENV || ""] || environments?.["staging"];

   
export default config;           
