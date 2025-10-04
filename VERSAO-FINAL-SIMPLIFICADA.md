# Versão Final Simplificada - Anúncios

## ✅ Solução Implementada

Simplifiquei tudo ao máximo. Os anúncios agora são carregados diretamente no `GroupList.tsx` usando jQuery (mesma forma que grupos e categorias).

## 📋 Como Funciona

### 1. Carregamento Simples
```tsx
const loadAds = () => {
  $.ajax({
    url: `${apiUrl}/ads?count=10`,
    success: (data) => {
      setAds(data.data.ads);
    }
  });
};
```

### 2. Card Individual
```tsx
<AdsBanner ad={ads[Math.floor(index / 6) % ads.length]} />
```
- Cada anúncio é um card separado
- Aparece no grid como um grupo normal
- Background laranja para destaque

### 3. Distribuição
- A cada **6 grupos** → 1 anúncio
- Rotaciona entre os anúncios disponíveis
- Se tiver 3 anúncios: usa 0, 1, 2, 0, 1, 2...

## 🎨 Visual

### Card de Anúncio
```
┌──────────────────┐
│  [Patrocinador]  │ ← Badge branco
│                  │
│   🖼️             │ ← Imagem circular
│                  │
│   Título         │ ← Texto branco
│   Anúncio        │
│   Ver mais →     │ ← CTA
└──────────────────┘
   Fundo Laranja
```

### No Grid
```
[Grupo 1]  [Grupo 2]  [Grupo 3]
[Grupo 4]  [Grupo 5]  [Grupo 6]
[AD 🟠]    [Grupo 7]  [Grupo 8]  ← Anúncio integrado
[Grupo 9]  [Grupo 10] [Grupo 11]
```

## 🔧 Arquivos Finais

### GroupList.tsx
- `loadAds()` - Carrega anúncios via Ajax
- `ads` state - Armazena anúncios
- Distribui anúncios no map de grupos

### AdsBanner.tsx
- Recebe **UM anúncio** via prop
- Renderiza como card com classe `.group-item.ad-item`
- Sem lógica complexa

### AdsBanner.css
- Estilos para `.ad-item`
- Background gradient laranja
- Badge de patrocinador
- Hover effects

## 🚀 Deploy

```bash
cd frontend
npm run build
npm run deploy
```

## 🧪 Teste

1. Abra https://groups.rapport.tec.br
2. Pressione F12 (Console)
3. Deve aparecer: `✅ Anúncios carregados: X`
4. Role a página
5. A cada 6 grupos, deve ter um card laranja

## ❌ Se NÃO aparecer

### 1. Teste a API
```bash
curl https://groups.rapport.tec.br/api/ads?count=10
```

Deve retornar JSON com anúncios.

### 2. Verifique o Console
Abra F12 e veja se aparece:
- ✅ `✅ Anúncios carregados: 3`
- ❌ `❌ Erro ao carregar anúncios`

### 3. Verifique o arquivo
```bash
cat backend/config/ads.json
```

Deve ter pelo menos 1 anúncio válido.

### 4. Force Rebuild
```bash
cd frontend
rm -rf build node_modules/.cache
npm install
npm run build
npm run deploy
```

## 📊 Checklist

- [ ] API `/api/ads` retorna dados
- [ ] Console mostra "✅ Anúncios carregados"
- [ ] Cards laranja aparecem no grid
- [ ] Cards NÃO piscam ou somem
- [ ] Badge "Patrocinador" visível
- [ ] Click leva ao link correto

## 🎯 Diferenças Chave

### Antes (complexo)
- ❌ Hook customizado
- ❌ Cache global complexo
- ❌ Promise compartilhada
- ❌ Multiple re-renders

### Agora (simples)
- ✅ Ajax direto no componente
- ✅ State simples
- ✅ Sem cache complicado
- ✅ Carrega uma vez e pronto

## 🔍 Debug

Se continuar com problemas, cole no console:

```javascript
// Verifica se anúncios foram carregados
fetch('https://groups.rapport.tec.br/api/ads?count=10')
  .then(r => r.json())
  .then(d => console.log('API Response:', d))
  .catch(e => console.error('API Error:', e));
```

## 💡 Explicação da Lógica

```tsx
// Linha 278-280 em GroupList.tsx
{(index + 1) % 6 === 0 && ads.length > 0 && (
  <AdsBanner ad={ads[Math.floor(index / 6) % ads.length]} />
)}
```

**O que faz:**
- `(index + 1) % 6 === 0` → A cada 6 grupos
- `ads.length > 0` → Se tem anúncios
- `Math.floor(index / 6)` → Número do bloco (0, 1, 2...)
- `% ads.length` → Rotaciona pelos anúncios

**Exemplo com 3 anúncios:**
- Grupo 6 (index 5): anúncio 0
- Grupo 12 (index 11): anúncio 1  
- Grupo 18 (index 17): anúncio 2
- Grupo 24 (index 23): anúncio 0 (volta ao início)

---

**Esta é a versão mais simples possível. Se funcionar, ótimo. Se não, o problema está na API ou no backend.** 🔍
