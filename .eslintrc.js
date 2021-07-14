module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": [
        "plugin:prettier/recommended",
        "airbnb-base",
        "eslint:recommended",
    ],
    "plugins": ["prettier"],
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "rules": {
        "semi": ["error", "always"],
        "quotes": ["error", "double"],
        "prettier/prettier": "error"
    }
};
