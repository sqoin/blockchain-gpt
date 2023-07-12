Blockchain GPT Terminal

To run the project please follow those steps:

## Installation 
1. Install docker in your computer

## Cloning the project
2. Clone the project by runing in your terminal : 
    * git clone https://github.com/zdbrig/blockchain-gpt/tree/amalChaabi/terminal_ts

##  Create Super Token account 
3. Check the Super Token dashbord thought this link https://supertokens.com/dashboard-saas 
4. Save the Core connectionURI and Core API key

## Setup Social Credetial
In our project we are using Google and Github , you can read Super Token documentation for other options.
Those links contain the process step-by-step
    * Google : https://support.google.com/workspacemigrate/answer/9222992?hl=en

    * Github :  https://docs.github.com/en/apps/creating-github-apps/creating-github-apps/creating-a-github-app

## Set up Google account sign in + sign up
    * Go to https://console.cloud.google.com/
    * In the dropdown up, select your project (Or create one if you do not have any)
    * After selecting/creating your project open the menu on the left side of the page and select: APIs & Services > Credentials
    * Click on: "Create credentials" and select "OAuth client ID" 
    * select the application type (web application)
    * in Authorized redirect URIs add the redirect URL (default: http://localhost:3000/auth/callback/google)
    * click on create
    * copy the client ID and the client secret and add them to the /blockchain-gpt/backend/auth/.env file.

## Edit environement files
3. Go backend/auth and create .env file and set values 
    * URI=  /* Core connectionURI that you saved */
    * KEY= /* Core API key */

    * CLIENT_ID= /* Google Client ID */
    * CLIENT_SECRET=/* Google Client Secret*/




    * GITHUB_CLIENT= /* Github Client */
    * GITHUB_SECRET= /* Github Secret */ 

4. Go backend/blockchain_gpt , create .env file and set value 
    * API_KEY= /* Chat GPT API Key*/

5. Go frontend , create .env file and set value
    * SKIP_PREFLIGHT_CHECK=true
    * it takes true or false: 
        * true : ignore eslint check
        * false : dont ignore eslint check


## Run
6. Run in your terminal inside the project folder :
    * docker compose build 

7. After the build run :
    * docker compose up 

## Usage
5. Open the browser  :
   *  frontend: http://localhost:3000

   *  User Managment Dashboard: http://localhost:3001/auth/dashboard 

## Terminate
6. Run in your terminal :
    * docker compose down 


