
# HeyGov (Backend)

HeyGov Mini CRM provides an easy way to quickly add contacts & easily manage or find existing ones. The backend is integrated into OpenAI and Anthropic to extract contact information from the text provided by the user. The backend first attempts to use OpenAI function calling logic to extract the information. If this goes wrong, it falls back to Anthropic.

## Requirements
1. Mac OS (feel free to use any OS).
2. [Git](https://git-scm.com/).
3. [Node JS](https://nodejs.org) (NPM)
4. [Express JS](https://expressjs.com/).
5. [MySQL](https://www.mysql.com/).

## Usage
Navigate to the project directory in your terminal and run the command below to install the required packages

```bash
npm install
```

Start up application

```bash
npm run dev
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Documentation
The APIs are documented in Postman. Here's a public link to the [documentation](https://documenter.getpostman.com/view/2943325/2sA35G2MN9)