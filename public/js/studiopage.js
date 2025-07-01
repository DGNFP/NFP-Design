    // 탭 전환 기능
    document.querySelectorAll('.studio-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.studio-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(this.dataset.tab).classList.add('active');
        });
    });

    // QR 코드 생성
    function generateQR() {
        const input = document.getElementById('qr-input').value;
        const size = parseInt(document.getElementById('qr-size').value);
        const canvas = document.getElementById('qr-canvas');
        
        if (!input.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }
        
        QRCode.toCanvas(canvas, input, {
            width: size,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        }, function (error) {
            if (error) {
                console.error(error);
                alert('QR 코드 생성에 실패했습니다.');
            } else {
                document.getElementById('download-btn').style.display = 'inline-block';
            }
        });
    }

    // QR 코드 다운로드
    function downloadQR() {
        const canvas = document.getElementById('qr-canvas');
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = canvas.toDataURL();
        link.click();
    }

    // 컬러 팔레트 생성
    function generatePalette() {
        const baseColor = document.getElementById('base-color').value;
        const type = document.getElementById('palette-type').value;
        const result = document.getElementById('palette-result');
        
        let colors = [];
        const hsl = hexToHsl(baseColor);
        
        switch(type) {
            case 'monochrome':
                colors = generateMonochrome(hsl);
                break;
            case 'analogous':
                colors = generateAnalogous(hsl);
                break;
            case 'complementary':
                colors = generateComplementary(hsl);
                break;
            case 'triadic':
                colors = generateTriadic(hsl);
                break;
            case 'gradient':
                colors = generateGradient(hsl);
                break;
        }
        
        displayColors(colors, result);
    }

    function hexToHsl(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return [h * 360, s * 100, l * 100];
    }

    function hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    function generateMonochrome(hsl) {
        const colors = [];
        for (let i = 0; i < 5; i++) {
            const lightness = 20 + (i * 20);
            colors.push(hslToHex(hsl[0], hsl[1], lightness));
        }
        return colors;
    }

    function generateAnalogous(hsl) {
        const colors = [];
        for (let i = -2; i <= 2; i++) {
            const hue = (hsl[0] + i * 30) % 360;
            colors.push(hslToHex(hue, hsl[1], hsl[2]));
        }
        return colors;
    }

    function generateComplementary(hsl) {
        const colors = [];
        colors.push(hslToHex(hsl[0], hsl[1], hsl[2]));
        colors.push(hslToHex((hsl[0] + 180) % 360, hsl[1], hsl[2]));
        colors.push(hslToHex(hsl[0], hsl[1] * 0.7, hsl[2] * 1.2));
        colors.push(hslToHex((hsl[0] + 180) % 360, hsl[1] * 0.7, hsl[2] * 1.2));
        colors.push(hslToHex(hsl[0], hsl[1] * 0.5, hsl[2] * 0.8));
        return colors;
    }

    function generateTriadic(hsl) {
        const colors = [];
        colors.push(hslToHex(hsl[0], hsl[1], hsl[2]));
        colors.push(hslToHex((hsl[0] + 120) % 360, hsl[1], hsl[2]));
        colors.push(hslToHex((hsl[0] + 240) % 360, hsl[1], hsl[2]));
        colors.push(hslToHex(hsl[0], hsl[1] * 0.6, hsl[2] * 1.1));
        colors.push(hslToHex((hsl[0] + 120) % 360, hsl[1] * 0.6, hsl[2] * 1.1));
        return colors;
    }

    function generateGradient(hsl) {
        const colors = [];
        const endHue = (hsl[0] + 60) % 360;
        for (let i = 0; i < 5; i++) {
            const ratio = i / 4;
            const hue = hsl[0] + (endHue - hsl[0]) * ratio;
            const saturation = hsl[1] + (80 - hsl[1]) * ratio;
            const lightness = hsl[2] + (60 - hsl[2]) * ratio;
            colors.push(hslToHex(hue, saturation, lightness));
        }
        return colors;
    }

    function displayColors(colors, container) {
        container.innerHTML = '';
        colors.forEach(color => {
            const item = document.createElement('div');
            item.className = 'color-item';
            item.innerHTML = `
                <div class="color-preview" style="background-color: ${color}"></div>
                <div class="color-code">${color}</div>
                <div class="color-code">RGB: ${hexToRgb(color)}</div>
            `;
            item.addEventListener('click', () => {
                navigator.clipboard.writeText(color);
                alert(`${color} 색상 코드가 복사되었습니다!`);
            });
            container.appendChild(item);
        });
    }

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
    }

    // 이미지 컬러 추출
    document.getElementById('image-file').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            extractColorsFromImage(file);
        }
    });

    // 드래그 앤 드롭
    const uploadArea = document.getElementById('image-upload');
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            extractColorsFromImage(files[0]);
        }
    });

    function extractColorsFromImage(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.getElementById('extraction-canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                const colors = extractDominantColors(ctx, canvas.width, canvas.height);
                displayColors(colors, document.getElementById('extracted-colors'));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function extractDominantColors(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const colorCounts = {};
        
        // 샘플링 (성능을 위해 일부 픽셀만 분석)
        for (let i = 0; i < data.length; i += 40) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const alpha = data[i + 3];
            
            if (alpha > 128) { // 투명하지 않은 픽셀만
                const color = `${r},${g},${b}`;
                colorCounts[color] = (colorCounts[color] || 0) + 1;
            }
        }
        
        // 가장 많이 사용된 색상들 정렬
        const sortedColors = Object.entries(colorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([color]) => {
                const [r, g, b] = color.split(',').map(Number);
                return rgbToHex(r, g, b);
            });
        
        return sortedColors;
    }

    function rgbToHex(r, g, b) {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }

    // 폰트 크기 계산
    function calculateFontSizes() {
        const baseSize = parseFloat(document.getElementById('base-font').value);
        const ratio = parseFloat(document.getElementById('scale-ratio').value);
        const result = document.getElementById('font-result');
        
        const sizes = {
            'Small': Math.round(baseSize / ratio),
            'Body': Math.round(baseSize),
            'H6': Math.round(baseSize * ratio),
            'H5': Math.round(baseSize * Math.pow(ratio, 2)),
            'H4': Math.round(baseSize * Math.pow(ratio, 3)),
            'H3': Math.round(baseSize * Math.pow(ratio, 4)),
            'H2': Math.round(baseSize * Math.pow(ratio, 5)),
            'H1': Math.round(baseSize * Math.pow(ratio, 6))
        };
        
        let html = '<h4>폰트 크기 스케일</h4>';
        for (const [name, size] of Object.entries(sizes)) {
            html += `<div>${name}: ${size}px</div>`;
        }
        
        result.innerHTML = html;
        result.style.display = 'block';
    }

    // 그리드 계산
    function calculateGrid() {
        const containerWidth = parseInt(document.getElementById('container-width').value);
        const columns = parseInt(document.getElementById('columns').value);
        const gutter = parseInt(document.getElementById('gutter').value);
        const result = document.getElementById('grid-result');
        
        const totalGutters = (columns - 1) * gutter;
        const availableWidth = containerWidth - totalGutters;
        const columnWidth = availableWidth / columns;
        
        let html = '<h4>그리드 계산 결과</h4>';
        html += `<div>컨테이너 너비: ${containerWidth}px</div>`;
        html += `<div>컬럼 너비: ${Math.round(columnWidth)}px</div>`;
        html += `<div>거터 크기: ${gutter}px</div>`;
        html += `<div>사용 가능한 너비: ${availableWidth}px</div>`;
        
        result.innerHTML = html;
        result.style.display = 'block';
    }

    // 페이지 로드 시 기본값 생성
    document.addEventListener('DOMContentLoaded', function() {
        generateQR();
        generatePalette();
    });
