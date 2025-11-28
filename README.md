docker-compose up --build

(GET)http://localhost:8080/api/test/all

(GET)http://localhost:8080/api/test/user

(GET)http://localhost:8080/api/test/admin

(POST)http://localhost:8080/api/auth/signup

(POST)http://localhost:8080/api/auth/signin

curl -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYxOTQzNDExLCJleHAiOjE3NjE5NDQzMTF9.fsIiHo9ho9XRc1eG36chPkecWBC6DuftpVo4XEaaJIk" http://localhost:8080/api/test/user

"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYxOTQzNDExLCJleHAiOjE3NjE5NDQzMTF9.fsIiHo9ho9XRc1eG36chPkecWBC6DuftpVo4XEaaJIk","refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYxOTQzNDExLCJleHAiOjE3NjI1NDgyMTF9.LW9ukZ6EUkqq3Y-Y2idQjpt0Qad5KxO0wJjdvms9qSE"}%  
curl -X POST http://localhost:8080/api/auth/refresh \
 -H "Content-Type: application/json" \
 -d '{
"refreshToken": "'"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYxOTQzNDExLCJleHAiOjE3NjI1NDgyMTF9.LW9ukZ6EUkqq3Y-Y2idQjpt0Qad5KxO0wJjdvms9qSE"'"
}'

{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYxOTQzNTE1LCJleHAiOjE3NjE5NDQ0MTV9.9VaU6pSzb5JAvUoGK6HfQZm-KHAGNnzGtGMnS1wsT3w","refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYxOTQzNTE1LCJleHAiOjE3NjI1NDgzMTV9.BzT2UXWuImn3xD94YeMVTVQ8cRJMln2wVbtEMyQ94ow"}%

# Используем новый токен

curl -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYxOTQzNTE1LCJleHAiOjE3NjE5NDQ0MTV9.9VaU6pSzb5JAvUoGK6HfQZm-KHAGNnzGtGMnS1wsT3w" http://localhost:8080/api/test/user

# Ответ: "Test User lab4."

# Выход из системы

curl -X POST http://localhost:8080/api/auth/logout \
 -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYxOTQzNDExLCJleHAiOjE3NjE5NDQzMTF9.fsIiHo9ho9XRc1eG36chPkecWBC6DuftpVo4XEaaJIk"

# Ответ: {"message":"Logged out successfully!"}

# Попытка обновить токен после выхода

curl -X POST http://localhost:8080/api/auth/refresh \
 -H "Content-Type: application/json" \
 -d '{
"refreshToken": "'"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYxOTQzNTE1LCJleHAiOjE3NjI1NDgzMTV9.BzT2UXWuImn3xD94YeMVTVQ8cRJMln2wVbtEMyQ94ow"'"
}'

# Ответ: {"message":"Refresh token doesn't match!"}

# Попытка доступа с старым access token

curl -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYxOTQzNTE1LCJleHAiOjE3NjE5NDQ0MTV9.9VaU6pSzb5JAvUoGK6HfQZm-KHAGNnzGtGMnS1wsT3w" http://localhost:8080/api/test/user

# Ответ: {"message":"Unauthorized!"} (если токен уже истек)

curl -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYxOTQzNDExLCJleHAiOjE3NjE5NDQzMTF9.fsIiHo9ho9XRc1eG36chPkecWBC6DuftpVo4XEaaJIk" http://localhost:8080/api/test/user

curl -X POST http://localhost:8080/api/auth/signin \
 -H "Content-Type: application/json" \
 -c cookies.txt \
 -d '{
"username": "testuser",
"password": "password123"
}'

# Подключитесь к базе

docker-compose exec db psql -U test_admin -d test_lab4_1 -c "SELECT 1 as status;"

curl -v -X POST http://localhost:8080/api/auth/signin \
 -d '{"username":"test","password":"test"}'

curl -X POST -H "Content-Type: application/json" -d '{
"username": "jwttest",
"password": "123456"
}' http://localhost:8080/api/auth/signin
{"id":1,"username":"jwttest","email":"jwttest@example.com","roles":["ROLE_USER"],"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODc1NDY4LCJleHAiOjE3NjI4NzYzNjh9.ZJ4rKU7b82JCUvD_FZIbPuxK-TNJ8umFQ-wm5diWVMY","refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODc1NDY4LCJleHAiOjE3NjI4NzU2NDh9.PF84ljRk1v-ZLhxl0u_OWLJiCAsT0K9uufzEQmBtc60","sessionId":"0046a183-bc43-4448-ba92-4d7bb0bea58c"}%

curl -X POST -H "Content-Type: application/json" -d '{
"refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODc2NTMyLCJleHAiOjE3NjM0ODEzMzJ9.vL-XZQjHwUooe3mQ4qcR3LE4DR-2HwGeAvNF1Jumnuk"
}' http://localhost:8080/api/auth/refresh

"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODc2NDc5LCJleHAiOjE3NjI4NzczNzl9.eyAU1dV4zUOr5U6fiHy45V8S55A_p-6VbluFJjlICgs","refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODc2NDc5LCJleHAiOjE3NjI4NzY2NTl9.lXI1sRR31ugLTLGurPb89hcWzcup3ymL_ljy-eqKnr4","sessionId":"03ad1367-52a0-4c53-a056-e23cd21ffbdd"}%
{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODc2NTA2LCJleHAiOjE3NjI4Nzc0MDZ9.0Mpsblg7qyT4t8hXvvgU5YAk-FyadvIqzW2Xu-gIg0o","refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODc2NTA2LCJleHAiOjE3NjM0ODEzMDZ9.bNm4SQCLu_JyRGKFIB2Un-1r0hhY3m450qVgP9i5VL0"}%

{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODc2NTMyLCJleHAiOjE3NjI4Nzc0MzJ9.\_SJXrNx5LtcxLL8YPtEpAiSuFHA7Ilp6rbB7-VZ-6dU","refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyODc2NTMyLCJleHAiOjE3NjM0ODEzMzJ9.vL-XZQjHwUooe3mQ4qcR3LE4DR-2HwGeAvNF1Jumnuk"}%

curl -X POST -H "Content-Type: application/json" -d '{  
"refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyOTQ1NzQ1LCJleHAiOjE3NjI5NDU5MjV9.-C5Jh70L6x_fiHiK49f_T4R7YeHy9iFeyoWOAjBgRu4"  
}' http://localhost:8080/api/auth/refresh
