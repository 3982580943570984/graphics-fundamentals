// ����������� ������� ��� �������� ��������� � ���������� ������
#define Resolution iResolution.xy

// �������� ������� �������, ������� ����� ���������� ��� ������� ������� �� ������
void mainImage(out vec4 FragColor, in vec2 FragCoord) {
    // ������������ ��������� �������, ����� ��� ���� � ��������� �� -1 �� 1
    vec2 normalizedCoord = (2.0 * FragCoord - Resolution) / Resolution.y;
    
    // ������������� ���������� ��� �������� ������� ������� � ����������� ���������
    vec2 position = vec2(0.0);
    
    // ���������� ��� �������� ���������� ��������
    float iterationCount = 0.0;
    
    // ���� �������� ��� ��������� �������� ������������
    for (; ++iterationCount <= 64.0 && dot(position, position) < 4.0;) {
        // ������� �������� ������������: z = z^2 + c, ��� z � c - ����������� �����,
        // z ���������� � 0, � c - ��� ������� ������� �������
        position = mat2(position, -position.y, position.x) * position + normalizedCoord;
    }
    
    // ������������ ���������� �������� � ��������� ����� �������
    FragColor = vec4(vec3(iterationCount / 64.0), 1.0);
}
