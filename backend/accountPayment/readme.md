
1: Create an account in https://cloud.mongodb.com and sign in

 2: Create a new project, a new cluster (near "database deployment"  click on create)

 3: Select your cluster adn click on "Connect" and select drivers

 4: Select the version and driver and install the mongodb driver you need

 5: Copy the link (normally it should be "mongodb+srv://YOUR_USERNME:YOUR_PASSWORD@DB_CLUSTER.......")

 6: create a .env file in blockchain-gpt/backend/accountPayment/
 
 ## .env structure: 
 DB_USERNAME= /* your username */
 DB_PWD= /* your password */
 DB_CLUSTER=DB_CLUSTER (by default it should be "atlascluster.token" the token value changes from cluster to cluster)


## to run this webservice: open the terminal in blockchain-gpt/backend/accountPayment/ and run the command: ts-node server.ts
