# 📝 Notas de Diseño — AuthentiZity

> Aquí se documentan las decisiones de diseño del proyecto.
> Última actualización: 3 de abril de 2026

---

## ✅ Paleta de Colores (extraída del branding PPTX)

| Nombre | Hex | Uso |
|--------|-----|-----|
| **Verde oscuro (primary)** | `#013F3F` | Color principal, fondos hero, headers |
| **Verde oscuro alt** | `#074040` | Variante del primary, hover states |
| **Teal / verde vivo** | `#0F9181` | Acentos, CTAs, links |
| **Teal claro** | `#079585` | Hover de acentos, badges |
| **Rosa/granate** | `#965458` | Color secundario, highlights, tags |
| **Rosa claro** | `#D6BEB7` | Fondos suaves, cards alternos |
| **Gris azulado** | `#305358` | Texto secundario, subtítulos |
| **Blanco roto** | `#F8F8F8` | Fondos de secciones alternas |

## ✅ Tipografía

| Uso | Fuente | Notas |
|-----|--------|-------|
| **Títulos / Headings** | **Chulapa Bold** | Tipografía del Ayto. de Madrid, CC BY 4.0. En `/public/fonts/` |
| **Cuerpo / Párrafos** | **Source Sans 3** (antes Source Sans Pro) | Google Fonts, gratuita |
| **Complementaria** | Chulapa Regular / Light | Para subtítulos o textos destacados |

> **Decisión**: P22 Mackinac descartada por falta de licencia web (~$200-300). Chulapa es la alternativa elegida para headings.

## ✅ Logo

- **`/public/images/logo-full.png`** — Logo cuadrado grande (6250×6250px)
- **`/public/images/logo.png`** — Logo horizontal (1536×1024px)
- **`download-4.png`** en inbox — imagen pequeña (183×275), parece un asset secundario

## Estilo General
- Limpio e institucional (referencia REDI)
- Paleta verde oscuro + rosa/granate como contraste
- Secciones alternas blanco (`#FFFFFF`) / blanco roto (`#F8F8F8`)
- Cards con bordes suaves y sombras sutiles
- Mucho espacio en blanco
- Tono profesional pero humano (impacto social)

## Decisiones Tomadas
- ✅ Paleta de colores definida desde PPTX branding
- ✅ Tipografías identificadas: P22 Mackinac (títulos) + Source Sans Pro (cuerpo) + Chulapa (complementaria)
- ✅ Logos copiados a `/public/images/`
- ✅ Fuentes Chulapa copiadas a `/public/fonts/`
