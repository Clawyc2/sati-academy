# 📁 Estructura de Imágenes - Sati Academy

## 🎯 Carpeta Principal
**Ruta en el repositorio:** `/public/images/`

---

## 📂 Estructura de Carpetas

```
public/
├── images/
│   ├── badges/          # Badges de logros
│   ├── lessons/         # Imágenes de lecciones
│   ├── achievements/    # Logros y recompensas
│   ├── profile/         # Avatares y fotos de perfil
│   └── icons/           # Iconos varios
└── icons/               # Iconos de la app
```

---

## 📤 Cómo Subir Imágenes

### Opción 1: GitHub Web
1. Ve a: https://github.com/Clawyc2/sati-academy
2. Click en "Add file" → "Upload files"
3. Arrastra tus imágenes a la carpeta correspondiente
4. Commit changes

### Opción 2: Git CLI
```bash
cd /home/ubuntu/.openclaw/workspace/sati-academy
# Copia tus imágenes a la carpeta correspondiente
cp tus-imagenes.png public/images/badges/
# Commit y push
git add public/images/
git commit -m "Añadir imágenes"
git push
```

---

## 🎨 Formatos Recomendados

| Tipo | Formato | Tamaño |
|------|---------|--------|
| Badges | PNG | 64x64 px |
| Lessons | PNG/JPG | 400x300 px |
| Profile | PNG | 128x128 px |
| Icons | SVG/PNG | 24x24 px |

---

## 🔗 URL de las Imágenes

Una vez subidas, se acceden así:

```javascript
// Badge
src="/images/badges/primera-leccion.png"

// Lesson
src="/images/lessons/que-es-bitcoin.png"

// Profile
src="/images/profile/avatar-default.png"
```

---

## 📝 Lista de Imágenes Necesarias

### Badges (Logros)
- [ ] Primera Lección
- [ ] 5 Lecciones Completadas
- [ ] 10 Lecciones Completadas
- [ ] Experto en Bitcoin
- [ ] Primer Quiz Perfecto

### Lessons
- [ ] ¿Qué es Bitcoin?
- [ ] ¿Cómo funciona Bitcoin?
- [ ] Wallets
- [ ] Seguridad
- [ ] Transacciones

### Profile
- [ ] Avatar default
- [ ] Niveles de perfil

### Icons
- [ ] Logo Sati Academy
- [ ] Iconos de navegación
- [ ] Iconos de acciones

---

_Creado: 2026-02-26_
