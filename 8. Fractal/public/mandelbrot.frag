// Определение макроса для удобства обращения к разрешению экрана
#define Resolution iResolution.xy

// Основная функция шейдера, которая будет вызываться для каждого пикселя на экране
void mainImage(out vec4 FragColor, in vec2 FragCoord) {
    // Нормализация координат пикселя, чтобы они были в диапазоне от -1 до 1
    vec2 normalizedCoord = (2.0 * FragCoord - Resolution) / Resolution.y;
    
    // Инициализация переменной для хранения текущей позиции в комплексной плоскости
    vec2 position = vec2(0.0);
    
    // Переменная для подсчета количества итераций
    float iterationCount = 0.0;
    
    // Цикл итераций для генерации фрактала Мандельброта
    for (; ++iterationCount <= 64.0 && dot(position, position) < 4.0;) {
        // Формула итерации Мандельброта: z = z^2 + c, где z и c - комплексные числа,
        // z начинается с 0, и c - это текущая позиция пикселя
        position = mat2(position, -position.y, position.x) * position + normalizedCoord;
    }
    
    // Нормализация количества итераций и установка цвета пикселя
    FragColor = vec4(vec3(iterationCount / 64.0), 1.0);
}
