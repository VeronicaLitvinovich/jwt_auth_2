# #!/bin/bash

# echo "=== 🧪 КОРРЕКТНОЕ ТЕСТИРОВАНИЕ JWT АУТЕНТИФИКАЦИИ ==="
# echo "Тестирование проводится в отдельных сессиях"
# echo

# BASE_URL="http://localhost:8080"
# GREEN='\033[0;32m'
# RED='\033[0;31m'
# YELLOW='\033[1;33m'
# BLUE='\033[0;34m'
# NC='\033[0m' # No Color

# # Функция для извлечения JSON значений
# get_json_value() {
#     echo "$1" | grep -o "\"$2\":\"[^\"]*" | cut -d'"' -f4
# }

# # Функция для вывода успешного результата
# print_success() {
#     echo -e "${GREEN}✅ $1${NC}"
# }

# # Функция для вывода ошибки
# print_error() {
#     echo -e "${RED}❌ $1${NC}"
# }

# # Функция для вывода информации
# print_info() {
#     echo -e "${BLUE}ℹ️  $1${NC}"
# }

# # Функция для вывода предупреждения
# print_warning() {
#     echo -e "${YELLOW}⚠️  $1${NC}"
# }

# echo -e "${BLUE}=== ТЕСТ 1: ПУБЛИЧНЫЙ ДОСТУП ===${NC}"
# echo "Публичный endpoint:"
# RESPONSE=$(curl -s "$BASE_URL/api/test/all")
# if [ "$RESPONSE" = "Test info lab4." ]; then
#     print_success "Публичный endpoint работает: $RESPONSE"
# else
#     print_error "Публичный endpoint не работает: $RESPONSE"
# fi
# echo

# echo -e "${BLUE}=== ТЕСТ 2: ТЕСТИРОВАНИЕ ПОЛЬЗОВАТЕЛЯ ===${NC}"
# echo "2.1. Регистрация пользователя..."
# USER_REGISTER=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
#   -H "Content-Type: application/json" \
#   -d '{"username":"testuser","email":"user@test.com","password":"user123","roles":["user"]}')
# if echo "$USER_REGISTER" | grep -q "successfully"; then
#     print_success "Пользователь зарегистрирован"
#     echo "$USER_REGISTER"
# else
#     print_error "Ошибка регистрации пользователя"
#     echo "$USER_REGISTER"
# fi
# echo

# echo "2.2. Вход пользователя..."
# USER_LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signin" \
#   -H "Content-Type: application/json" \
#   -d '{"username":"testuser","password":"user123"}')
# USER_ACCESS_TOKEN=$(get_json_value "$USER_LOGIN_RESPONSE" "accessToken")
# USER_REFRESH_TOKEN=$(get_json_value "$USER_LOGIN_RESPONSE" "refreshToken")

# if [ ! -z "$USER_ACCESS_TOKEN" ]; then
#     print_success "Пользователь успешно вошел в систему"
#     echo "Access Token: ${USER_ACCESS_TOKEN:0:30}..."
# else
#     print_error "Ошибка входа пользователя"
#     echo "$USER_LOGIN_RESPONSE"
# fi
# echo

# echo "2.3. Проверка доступа пользователя к /user:"
# USER_USER_ACCESS=$(curl -s -H "x-access-token: $USER_ACCESS_TOKEN" "$BASE_URL/api/test/user")
# if [ "$USER_USER_ACCESS" = "Test User lab4." ]; then
#     print_success "Пользователь имеет доступ к /user"
# else
#     print_error "Пользователь не имеет доступ к /user: $USER_USER_ACCESS"
# fi
# echo

# echo "2.4. Проверка доступа пользователя к /admin:"
# USER_ADMIN_ACCESS=$(curl -s -H "x-access-token: $USER_ACCESS_TOKEN" "$BASE_URL/api/test/admin")
# if echo "$USER_ADMIN_ACCESS" | grep -q "Require Admin Role"; then
#     print_success "Пользователь НЕ имеет доступ к /admin (корректно)"
# else
#     print_error "Некорректный ответ для пользователя при доступе к /admin: $USER_ADMIN_ACCESS"
# fi
# echo

# echo "2.5. Обновление токена пользователя..."
# REFRESH_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/refresh" \
#   -H "Content-Type: application/json" \
#   -d "{\"refreshToken\":\"$USER_REFRESH_TOKEN\"}")
# NEW_USER_TOKEN=$(get_json_value "$REFRESH_RESPONSE" "accessToken")

# if [ ! -z "$NEW_USER_TOKEN" ]; then
#     print_success "Токен пользователя успешно обновлен"
#     echo "Новый Access Token: ${NEW_USER_TOKEN:0:30}..."
# else
#     print_error "Ошибка обновления токена пользователя"
#     echo "$REFRESH_RESPONSE"
# fi
# echo

# echo "2.6. Проверка доступа с новым токеном:"
# NEW_TOKEN_ACCESS=$(curl -s -H "x-access-token: $NEW_USER_TOKEN" "$BASE_URL/api/test/user")
# if [ "$NEW_TOKEN_ACCESS" = "Test User lab4." ]; then
#     print_success "Новый токен работает корректно"
# else
#     print_error "Новый токен не работает: $NEW_TOKEN_ACCESS"
# fi
# echo

# echo "2.7. Выход пользователя..."
# LOGOUT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/logout" \
#   -H "x-access-token: $NEW_USER_TOKEN")
# if echo "$LOGOUT_RESPONSE" | grep -q "successfully"; then
#     print_success "Пользователь успешно вышел из системы"
# else
#     print_error "Ошибка выхода из системы"
#     echo "$LOGOUT_RESPONSE"
# fi
# echo

# echo -e "${BLUE}=== ТЕСТ 3: ТЕСТИРОВАНИЕ АДМИНИСТРАТОРА ===${NC}"
# echo "3.1. Регистрация администратора..."
# ADMIN_REGISTER=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
#   -H "Content-Type: application/json" \
#   -d '{"username":"adminuser","email":"admin@test.com","password":"admin123","roles":["admin"]}')
# if echo "$ADMIN_REGISTER" | grep -q "successfully"; then
#     print_success "Администратор зарегистрирован"
#     echo "$ADMIN_REGISTER"
# else
#     print_error "Ошибка регистрации администратора"
#     echo "$ADMIN_REGISTER"
# fi
# echo

# echo "3.2. Вход администратора..."
# ADMIN_LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signin" \
#   -H "Content-Type: application/json" \
#   -d '{"username":"adminuser","password":"admin123"}')
# ADMIN_ACCESS_TOKEN=$(get_json_value "$ADMIN_LOGIN_RESPONSE" "accessToken")
# ADMIN_REFRESH_TOKEN=$(get_json_value "$ADMIN_LOGIN_RESPONSE" "refreshToken")

# if [ ! -z "$ADMIN_ACCESS_TOKEN" ]; then
#     print_success "Администратор успешно вошел в систему"
#     echo "Access Token: ${ADMIN_ACCESS_TOKEN:0:30}..."
# else
#     print_error "Ошибка входа администратора"
#     echo "$ADMIN_LOGIN_RESPONSE"
# fi
# echo

# echo "3.3. Проверка доступа администратора к /user:"
# ADMIN_USER_ACCESS=$(curl -s -H "x-access-token: $ADMIN_ACCESS_TOKEN" "$BASE_URL/api/test/user")
# if [ "$ADMIN_USER_ACCESS" = "Test User lab4." ]; then
#     print_success "Администратор имеет доступ к /user"
# else
#     print_error "Администратор не имеет доступ к /user: $ADMIN_USER_ACCESS"
# fi
# echo

# echo "3.4. Проверка доступа администратора к /admin:"
# ADMIN_ADMIN_ACCESS=$(curl -s -H "x-access-token: $ADMIN_ACCESS_TOKEN" "$BASE_URL/api/test/admin")
# if [ "$ADMIN_ADMIN_ACCESS" = "Test Admin lab4." ]; then
#     print_success "Администратор имеет доступ к /admin"
# else
#     print_error "Администратор не имеет доступ к /admin: $ADMIN_ADMIN_ACCESS"
# fi
# echo

# echo "3.5. Обновление токена администратора..."
# ADMIN_REFRESH_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/refresh" \
#   -H "Content-Type: application/json" \
#   -d "{\"refreshToken\":\"$ADMIN_REFRESH_TOKEN\"}")
# NEW_ADMIN_TOKEN=$(get_json_value "$ADMIN_REFRESH_RESPONSE" "accessToken")

# if [ ! -z "$NEW_ADMIN_TOKEN" ]; then
#     print_success "Токен администратора успешно обновлен"
#     echo "Новый Access Token: ${NEW_ADMIN_TOKEN:0:30}..."
# else
#     print_error "Ошибка обновления токена администратора"
#     echo "$ADMIN_REFRESH_RESPONSE"
# fi
# echo

# echo "3.6. Проверка доступа с новым токеном администратора:"
# NEW_ADMIN_ACCESS=$(curl -s -H "x-access-token: $NEW_ADMIN_TOKEN" "$BASE_URL/api/test/admin")
# if [ "$NEW_ADMIN_ACCESS" = "Test Admin lab4." ]; then
#     print_success "Новый токен администратора работает корректно"
# else
#     print_error "Новый токен администратора не работает: $NEW_ADMIN_ACCESS"
# fi
# echo

# echo "3.7. Выход администратора..."
# ADMIN_LOGOUT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/logout" \
#   -H "x-access-token: $NEW_ADMIN_TOKEN")
# if echo "$ADMIN_LOGOUT_RESPONSE" | grep -q "successfully"; then
#     print_success "Администратор успешно вышел из системы"
# else
#     print_error "Ошибка выхода администратора из системы"
#     echo "$ADMIN_LOGOUT_RESPONSE"
# fi
# echo

# echo -e "${GREEN}=== 🎯 ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===${NC}"

#!/bin/bash
echo "=== Testing Refresh Token Generation ==="

# Вход
RESPONSE=$(curl -c refresh_test.txt -X POST -H "Content-Type: application/json" -d '{
  "username": "testuser",
  "password": "123456"
}' http://localhost:8080/api/auth/signin)

OLD_ACCESS=$(echo "$RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
OLD_REFRESH=$(echo "$RESPONSE" | grep -o '"refreshToken":"[^"]*' | cut -d'"' -f4)

echo "Old Access Token: ${OLD_ACCESS:0:50}..."
echo "Old Refresh Token: ${OLD_REFRESH:0:50}..."

# Ждем 2 секунды чтобы гарантировать новые токены
sleep 2

# Refresh
REFRESH_RESPONSE=$(curl -X POST -H "Content-Type: application/json" -d "{
  \"refreshToken\": \"$OLD_REFRESH\"
}" http://localhost:8080/api/auth/refresh)

NEW_ACCESS=$(echo "$REFRESH_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
NEW_REFRESH=$(echo "$REFRESH_RESPONSE" | grep -o '"refreshToken":"[^"]*' | cut -d'"' -f4)

echo "New Access Token: ${NEW_ACCESS:0:50}..."
echo "New Refresh Token: ${NEW_REFRESH:0:50}..."

# Проверяем, что токены разные
if [ "$OLD_ACCESS" != "$NEW_ACCESS" ]; then
    echo "✅ SUCCESS: Access token was updated!"
else
    echo "⚠️  Access tokens are the same (might be timing issue)"
fi

if [ "$OLD_REFRESH" != "$NEW_REFRESH" ]; then
    echo "✅ SUCCESS: Refresh token was updated!"
else
    echo "⚠️  Refresh tokens are the same (might be timing issue)"
fi