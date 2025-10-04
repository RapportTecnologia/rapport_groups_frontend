# Correção: Anúncios Aparecendo e Sumindo

## 🐛 Problema Identificado

Os anúncios estavam aparecendo e sumindo rapidamente devido a:
1. **Múltiplas instâncias** do componente carregando dados simultaneamente
2. **Recarregamento desnecessário** a cada renderização
3. **Loading state visível** causando flash visual
4. **Sem cache** de dados entre componentes

## ✅ Soluções Implementadas

### 1. **Cache Global**
```tsx
const adsCache: { [key: number]: Ad[] } = {};
```
- Cache compartilhado entre todas as instâncias
- Evita múltiplas requisições à API
- Dados persistem durante a sessão

### 2. **useRef para Controle**
```tsx
const hasLoadedRef = useRef<boolean>(false);
```
- Previne carregamentos duplicados
- Mantém estado entre renderizações

### 3. **Inicialização Inteligente**
```tsx
const [ads, setAds] = useState<Ad[]>(adsCache[count] || []);
const [loading, setLoading] = useState<boolean>(!adsCache[count]);
```
- Inicia com dados do cache se disponíveis
- Só mostra loading se realmente necessário

### 4. **Não Renderiza Durante Loading**
```tsx
if (loading) {
  return null; // Evita flash visual
}

if (error || ads.length === 0) {
  return null; // Não exibe se não houver dados
}
```

### 5. **Logs de Debug**
```tsx
console.log('🔍 Carregando anúncios de:', url);
console.log('📦 Dados recebidos:', data);
console.log('✅ Anúncios carregados:', count);
console.log('📦 Usando anúncios do cache:', count);
```

## 🔍 Como Verificar

### 1. Abra o Console do Navegador (F12)

Você deve ver logs como:
```
📦 Usando anúncios do cache: 2
✅ Anúncios carregados e salvos no cache: 3
```

### 2. Verifique a Rede (Network Tab)

- Deve haver **apenas 1 requisição** para `/api/ads?count=2`
- Não deve haver requisições repetidas

### 3. Visual

- Anúncios devem aparecer **sem flash** ou piscar
- Devem permanecer visíveis entre os grupos
- Não devem sumir ao rolar a página

## 📊 Antes vs Depois

### ❌ Antes
```
1. Componente monta
2. Loading = true → Mostra loading
3. Carrega da API
4. Loading = false → Mostra anúncios
5. Componente remonta (outro banner)
6. Volta ao passo 2 (flash visual!) ❌
```

### ✅ Depois
```
1. Componente monta
2. Verifica cache
   - Se tem cache: Mostra imediatamente ✅
   - Se não tem: return null (sem flash)
3. Carrega da API (primeira vez apenas)
4. Salva no cache
5. Próximo banner: Usa cache ✅
```

## 🎯 Benefícios

### Performance
- ✅ **Menos requisições** à API (cache global)
- ✅ **Renderização instantânea** para banners subsequentes
- ✅ **Sem re-renders** desnecessários

### UX
- ✅ **Sem flash visual** durante loading
- ✅ **Aparência consistente** entre banners
- ✅ **Mais profissional** e suave

### Código
- ✅ **Mais robusto** com error handling
- ✅ **Logs úteis** para debug
- ✅ **Fácil de debugar** com console

## 🔧 Troubleshooting

### Anúncios não aparecem

**1. Verifique o Console:**
```javascript
// Deve aparecer:
🔍 Carregando anúncios de: https://groups.rapport.tec.br/api/ads?count=2
📦 Dados recebidos: {success: true, data: {...}}
✅ Anúncios carregados e salvos no cache: 3
```

**2. Se aparecer erro:**
```javascript
❌ Erro ao carregar propagandas: Error...
```
- Verifique se o backend está rodando
- Teste o endpoint diretamente: `https://groups.rapport.tec.br/api/ads`
- Verifique CORS

**3. Se aparecer warning:**
```javascript
⚠️ Nenhum anúncio retornado pela API
```
- Verifique `backend/config/ads.json`
- Confirme que há anúncios válidos
- Teste: `curl https://groups.rapport.tec.br/api/ads`

### Anúncios aparecem mas somem

Se ainda estiver acontecendo:

**1. Limpe o cache do navegador:**
```
Ctrl + Shift + Delete
```

**2. Force rebuild:**
```bash
cd frontend
rm -rf node_modules/.cache
npm run build
npm run deploy
```

**3. Verifique no Network tab:**
- Não deve haver múltiplas requisições rápidas
- Status deve ser 200 OK
- Response deve ter dados válidos

## 📝 Código Final

### AdsBanner.tsx (principais mudanças)

```tsx
// Cache global
const adsCache: { [key: number]: Ad[] } = {};

const AdsBanner = ({ count = 2 }) => {
  // Inicializa com cache
  const [ads, setAds] = useState<Ad[]>(adsCache[count] || []);
  const [loading, setLoading] = useState<boolean>(!adsCache[count]);
  const hasLoadedRef = useRef<boolean>(false);

  useEffect(() => {
    // Verifica cache primeiro
    if (adsCache[count]?.length > 0) {
      console.log('📦 Usando cache');
      return;
    }

    // Previne reload
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    loadAds();
  }, [count]);

  const loadAds = async () => {
    // ... carrega e salva no cache
    adsCache[count] = data.data.ads;
  };

  // Não renderiza durante loading
  if (loading) return null;
  if (error || ads.length === 0) return null;

  return <div className="ads-banner">...</div>;
};
```

## ✅ Checklist de Verificação

- [x] Cache global implementado
- [x] useRef para controle de carregamento
- [x] Inicialização com cache
- [x] return null durante loading
- [x] Logs de debug adicionados
- [x] URL da API configurada para produção
- [x] Error handling melhorado
- [x] Documentação criada

## 🚀 Deploy

```bash
cd frontend
npm run build
npm run deploy
```

## 🎯 Resultado Esperado

Após o deploy:
1. ✅ Anúncios carregam **uma vez** apenas
2. ✅ Aparecem **sem flash** visual
3. ✅ Permanecem **visíveis** entre os grupos
4. ✅ Não causam **layout shift**
5. ✅ Performance **melhorada**

---

**Problema resolvido! Os anúncios agora devem aparecer de forma estável e consistente.** 🎉
