# notificator

Requirements: docker-compose, NodeJS v >=12 , NPM

## Run example

1. install dependencies 

    ```
    npm i
    ```

2. run rabbitmq using docker-compose:

    ```
    docker-compose up -d
    ```

3. For emulating multi processes notification interaction run in different terminals (you can open as meny notiicators/receivers as needed):

    ```
    # terminal 1
    npm run notify
    ```
    ```
    # terminal 2
    npm run receive
    ```