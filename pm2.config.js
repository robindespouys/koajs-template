module.exports = {
    apps: [{
        name: "koajs-template-prod",
        script: "./src/server.ts",
        watch: false,
        env: {
            "PORT": 4444,
            "NODE_ENV": "production"
        },
    }]
}