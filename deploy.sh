#!/bin/bash

echo "=========================================="
echo "  Deploy de LoyaltyVibes a Vercel"
echo "=========================================="
echo ""

# Verificar si Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm i -g vercel
fi

echo ""
echo "🚀 Iniciando deploy..."
echo ""

# Iniciar deploy
vercel --prod

echo ""
echo "✅ Deploy completado!"
echo ""
echo "📱 Tu aplicación está disponible en la URL que Vercel te mostró arriba"
echo "🎯 Para ver la demo page, agrega /demo al final de la URL"
echo ""
echo "Ejemplo: https://tu-proyecto.vercel.app/demo"
