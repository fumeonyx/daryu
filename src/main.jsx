import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { supabase, hasSupabaseConfig } from './supabase';
import './styles.css';

const RECIPIENTS = ['девушке', 'парню', 'маме', 'папе', 'подруге', 'другу', 'дедушке', 'бабушке', 'коллеге', 'ребёнку'];
const OCCASIONS = ['день рождения', 'новый год', '8 марта', '14 февраля', 'годовщина', 'новоселье', 'просто так'];
const INTERESTS = ['уют', 'техника', 'красота', 'спорт', 'книги', 'кулинария', 'дача', 'игры', 'творчество', 'путешествия', 'дом', 'здоровье'];
const PERSONALITIES = ['практичный', 'романтичный', 'домашний', 'активный', 'творческий', 'любит необычное'];

const GIFTS = [
  {
    id: 1,
    title: 'Подарочный бокс с уходом',
    price: 2600,
    emoji: '🧴',
    recipients: ['девушке', 'маме', 'подруге', 'бабушке'],
    occasions: ['день рождения', 'новый год', '8 марта', 'просто так'],
    interests: ['красота', 'уют'],
    personalities: ['романтичный', 'домашний'],
    tags: ['нежно', 'универсально', 'легко собрать'],
    why: 'Можно собрать под человека: крем для рук, маска, свеча, мини-парфюм, сладость.',
    shopUrl: 'https://www.ozon.ru/search/?text=%D0%BF%D0%BE%D0%B4%D0%B0%D1%80%D0%BE%D1%87%D0%BD%D1%8B%D0%B9+%D0%B1%D0%BE%D0%BA%D1%81+%D1%81+%D1%83%D1%85%D0%BE%D0%B4%D0%BE%D0%BC'
  },
  {
    id: 2,
    title: 'Умная колонка',
    price: 6500,
    emoji: '🔊',
    recipients: ['парню', 'папе', 'другу', 'маме', 'коллеге'],
    occasions: ['день рождения', 'новый год', 'новоселье'],
    interests: ['техника', 'дом'],
    personalities: ['практичный', 'любит необычное'],
    tags: ['гаджет', 'для дома', 'вау-эффект'],
    why: 'Музыка, будильники, быстрые ответы, умный дом — подарок часто реально используют.',
    shopUrl: 'https://www.ozon.ru/search/?text=%D1%83%D0%BC%D0%BD%D0%B0%D1%8F+%D0%BA%D0%BE%D0%BB%D0%BE%D0%BD%D0%BA%D0%B0'
  },
  {
    id: 3,
    title: 'Электрическая мельница для специй',
    price: 1800,
    emoji: '🧂',
    recipients: ['маме', 'папе', 'дедушке', 'бабушке', 'коллеге'],
    occasions: ['день рождения', 'новый год', 'просто так'],
    interests: ['кулинария', 'дом'],
    personalities: ['практичный', 'домашний'],
    tags: ['недорого', 'полезно', 'кухня'],
    why: 'Выглядит интереснее обычной мелочи и подходит тем, кто готовит дома.',
    shopUrl: 'https://www.ozon.ru/search/?text=%D1%8D%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F+%D0%BC%D0%B5%D0%BB%D1%8C%D0%BD%D0%B8%D1%86%D0%B0+%D0%B4%D0%BB%D1%8F+%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B9'
  },
  {
    id: 4,
    title: 'Набор для выращивания микрозелени',
    price: 1500,
    emoji: '🌱',
    recipients: ['маме', 'бабушке', 'дедушке', 'подруге'],
    occasions: ['день рождения', '8 марта', 'новый год', 'просто так'],
    interests: ['дача', 'кулинария', 'здоровье'],
    personalities: ['домашний', 'любит необычное'],
    tags: ['уютно', 'растения', 'необычно'],
    why: 'Хороший вариант для тех, кто любит растения, огород или домашние эксперименты.',
    shopUrl: 'https://www.ozon.ru/search/?text=%D0%BD%D0%B0%D0%B1%D0%BE%D1%80+%D0%B4%D0%BB%D1%8F+%D0%B2%D1%8B%D1%80%D0%B0%D1%89%D0%B8%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F+%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D0%B7%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8'
  },
  {
    id: 5,
    title: 'Плед с рукавами',
    price: 2400,
    emoji: '🧸',
    recipients: ['девушке', 'маме', 'бабушке', 'другу', 'подруге'],
    occasions: ['новый год', 'день рождения', 'просто так'],
    interests: ['уют', 'дом', 'книги'],
    personalities: ['домашний', 'романтичный'],
    tags: ['уют', 'зима', 'безопасный выбор'],
    why: 'Милый, тёплый и понятный подарок, особенно если человек любит вечера дома.',
    shopUrl: 'https://www.ozon.ru/search/?text=%D0%BF%D0%BB%D0%B5%D0%B4+%D1%81+%D1%80%D1%83%D0%BA%D0%B0%D0%B2%D0%B0%D0%BC%D0%B8'
  },
  {
    id: 6,
    title: 'Настольная игра для компании',
    price: 2200,
    emoji: '🎲',
    recipients: ['другу', 'подруге', 'парню', 'девушке', 'коллеге'],
    occasions: ['день рождения', 'новый год', 'новоселье'],
    interests: ['игры', 'дом'],
    personalities: ['активный', 'любит необычное'],
    tags: ['для компании', 'весело', 'вечеринки'],
    why: 'Подарок не просто лежит на полке, а создаёт повод собраться.',
    shopUrl: 'https://www.ozon.ru/search/?text=%D0%BD%D0%B0%D1%81%D1%82%D0%BE%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F+%D0%B8%D0%B3%D1%80%D0%B0+%D0%B4%D0%BB%D1%8F+%D0%BA%D0%BE%D0%BC%D0%BF%D0%B0%D0%BD%D0%B8%D0%B8'
  },
  {
    id: 7,
    title: 'Сертификат в книжный магазин',
    price: 3000,
    emoji: '📚',
    recipients: ['маме', 'папе', 'подруге', 'другу', 'коллеге', 'бабушке'],
    occasions: ['день рождения', 'новый год', 'просто так'],
    interests: ['книги', 'творчество'],
    personalities: ['практичный', 'домашний'],
    tags: ['без промаха', 'для читателей', 'выбор за ним'],
    why: 'Подходит, когда боишься не угадать с конкретной книгой.',
    shopUrl: 'https://www.ozon.ru/search/?text=%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82+%D0%B2+%D0%BA%D0%BD%D0%B8%D0%B6%D0%BD%D1%8B%D0%B9+%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD'
  },
  {
    id: 8,
    title: 'Портативный массажёр для шеи',
    price: 4200,
    emoji: '💆',
    recipients: ['маме', 'папе', 'дедушке', 'бабушке', 'коллеге'],
    occasions: ['день рождения', 'новый год'],
    interests: ['здоровье', 'дом'],
    personalities: ['практичный', 'домашний'],
    tags: ['забота', 'полезно', 'для отдыха'],
    why: 'Выглядит как заботливый подарок, особенно для тех, кто много сидит или устаёт.',
    shopUrl: 'https://www.ozon.ru/search/?text=%D0%BF%D0%BE%D1%80%D1%82%D0%B0%D1%82%D0%B8%D0%B2%D0%BD%D1%8B%D0%B9+%D0%BC%D0%B0%D1%81%D1%81%D0%B0%D0%B6%D0%B5%D1%80+%D0%B4%D0%BB%D1%8F+%D1%88%D0%B5%D0%B8'
  },
  {
    id: 9,
    title: 'Набор красивых бокалов',
    price: 3500,
    emoji: '🥂',
    recipients: ['подруге', 'девушке', 'маме', 'коллеге'],
    occasions: ['новоселье', 'день рождения', 'годовщина'],
    interests: ['дом', 'уют'],
    personalities: ['романтичный', 'домашний'],
    tags: ['эстетично', 'для дома', 'красиво'],
    why: 'Подойдёт тем, кто любит красивую сервировку и уютные домашние детали.',
    shopUrl: 'https://www.ozon.ru/search/?text=%D0%BD%D0%B0%D0%B1%D0%BE%D1%80+%D0%B1%D0%BE%D0%BA%D0%B0%D0%BB%D0%BE%D0%B2'
  },
  {
    id: 10,
    title: 'Фитнес-резинки и дневник тренировок',
    price: 1700,
    emoji: '🏋️',
    recipients: ['девушке', 'парню', 'подруге', 'другу'],
    occasions: ['день рождения', 'новый год', 'просто так'],
    interests: ['спорт', 'здоровье'],
    personalities: ['активный', 'практичный'],
    tags: ['спорт', 'недорого', 'мотивация'],
    why: 'Нормальный подарок для человека, который уже интересуется тренировками.',
    shopUrl: 'https://www.ozon.ru/search/?text=%D1%84%D0%B8%D1%82%D0%BD%D0%B5%D1%81+%D1%80%D0%B5%D0%B7%D0%B8%D0%BD%D0%BA%D0%B8+%D0%B4%D0%BD%D0%B5%D0%B2%D0%BD%D0%B8%D0%BA+%D1%82%D1%80%D0%B5%D0%BD%D0%B8%D1%80%D0%BE%D0%B2%D0%BE%D0%BA'
  },
  {
    id: 11,
    title: 'Мини-принтер для фото',
    price: 7500,
    emoji: '📸',
    recipients: ['девушке', 'подруге', 'ребёнку', 'парню'],
    occasions: ['день рождения', 'новый год', '14 февраля'],
    interests: ['творчество', 'путешествия', 'техника'],
    personalities: ['творческий', 'любит необычное'],
    tags: ['милый гаджет', 'фото', 'творчество'],
    why: 'Можно печатать фото, делать коллажи, дневники, открытки и декор.',
    shopUrl: 'https://www.ozon.ru/search/?text=%D0%BC%D0%B8%D0%BD%D0%B8+%D0%BF%D1%80%D0%B8%D0%BD%D1%82%D0%B5%D1%80+%D0%B4%D0%BB%D1%8F+%D1%84%D0%BE%D1%82%D0%BE'
  },
  {
    id: 12,
    title: 'Садовый органайзер для инструментов',
    price: 3200,
    emoji: '🧺',
    recipients: ['дедушке', 'бабушке', 'маме', 'папе'],
    occasions: ['день рождения', 'новый год', 'просто так'],
    interests: ['дача', 'дом'],
    personalities: ['практичный'],
    tags: ['для дачи', 'полезно', 'организация'],
    why: 'Хорошо зайдёт тем, кто выращивает рассаду, виноград, помидоры или любит порядок на даче.',
    shopUrl: 'https://www.ozon.ru/search/?text=%D1%81%D0%B0%D0%B4%D0%BE%D0%B2%D1%8B%D0%B9+%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B0%D0%B9%D0%B7%D0%B5%D1%80+%D0%B4%D0%BB%D1%8F+%D0%B8%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%BE%D0%B2'
  },
  {
    id: 13,
    title: 'Проектор звёздного неба',
    price: 2900,
    emoji: '🌌',
    recipients: ['девушке', 'ребёнку', 'подруге', 'парню'],
    occasions: ['день рождения', '14 февраля', 'новый год'],
    interests: ['уют', 'дом', 'техника'],
    personalities: ['романтичный', 'любит необычное'],
    tags: ['атмосфера', 'уют', 'романтично'],
    why: 'Создаёт красивый свет в комнате и ощущается как подарок-настроение.',
    shopUrl: 'https://www.ozon.ru/search/?text=%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%BE%D1%80+%D0%B7%D0%B2%D0%B5%D0%B7%D0%B4%D0%BD%D0%BE%D0%B3%D0%BE+%D0%BD%D0%B5%D0%B1%D0%B0'
  },
  {
    id: 14,
    title: 'Термокружка хорошего качества',
    price: 2300,
    emoji: '☕',
    recipients: ['другу', 'подруге', 'папе', 'маме', 'коллеге', 'парню'],
    occasions: ['день рождения', 'новый год', 'просто так'],
    interests: ['путешествия', 'спорт', 'дом'],
    personalities: ['практичный', 'активный'],
    tags: ['каждый день', 'полезно', 'универсально'],
    why: 'Подходит для дороги, работы, прогулок и кофе с собой.',
    shopUrl: 'https://www.ozon.ru/search/?text=%D1%82%D0%B5%D1%80%D0%BC%D0%BE%D0%BA%D1%80%D1%83%D0%B6%D0%BA%D0%B0'
  },
  {
    id: 15,
    title: 'Набор для домашнего какао',
    price: 1900,
    emoji: '🍫',
    recipients: ['девушке', 'подруге', 'маме', 'ребёнку', 'коллеге'],
    occasions: ['новый год', 'день рождения', '14 февраля', 'просто так'],
    interests: ['уют', 'кулинария'],
    personalities: ['романтичный', 'домашний'],
    tags: ['сладко', 'уютно', 'недорого'],
    why: 'Какао, маршмеллоу, кружка и открытка — простой, но очень милый набор.',
    shopUrl: 'https://www.ozon.ru/search/?text=%D0%BD%D0%B0%D0%B1%D0%BE%D1%80+%D0%B4%D0%BB%D1%8F+%D0%BA%D0%B0%D0%BA%D0%B0%D0%BE'
  },
  {
    id: 16,
    title: 'Подарочная карта на впечатление',
    price: 5000,
    emoji: '🎟️',
    recipients: ['девушке', 'парню', 'другу', 'подруге'],
    occasions: ['день рождения', 'годовщина', '14 февраля'],
    interests: ['путешествия', 'спорт', 'творчество'],
    personalities: ['активный', 'любит необычное'],
    tags: ['эмоции', 'не вещь', 'запомнится'],
    why: 'Хороший вариант, если человек не любит лишние вещи, но любит новые эмоции.',
    shopUrl: 'https://www.ozon.ru/search/?text=%D0%BF%D0%BE%D0%B4%D0%B0%D1%80%D0%BE%D1%87%D0%BD%D0%B0%D1%8F+%D0%BA%D0%B0%D1%80%D1%82%D0%B0+%D0%BD%D0%B0+%D0%B2%D0%BF%D0%B5%D1%87%D0%B0%D1%82%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5'
  }
];

const formatRub = (value) => new Intl.NumberFormat('ru-RU').format(value) + ' ₽';

function readParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    recipient: params.get('recipient') || '',
    occasion: params.get('occasion') || '',
    budget: Number(params.get('budget')) || 5000,
    personality: params.get('personality') || '',
    interests: params.get('interests') ? params.get('interests').split(',').filter(Boolean) : []
  };
}

function App() {
  const [form, setForm] = useState(readParams);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('daryu-favorites') || '[]'));
  const [customGifts, setCustomGifts] = useState(() => JSON.parse(localStorage.getItem('daryu-custom-gifts') || '[]'));
  const [newGift, setNewGift] = useState({
    title: '',
    price: '',
    emoji: '🎁',
    recipients: '',
    occasions: '',
    interests: '',
    personalities: '',
    tags: '',
    why: '',
    shopUrl: ''
  });
  const [copied, setCopied] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showAddGiftForm, setShowAddGiftForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [cloudStatus, setCloudStatus] = useState(hasSupabaseConfig ? 'Подключаем Supabase...' : 'Локальный режим');

  useEffect(() => {
    localStorage.setItem('daryu-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (hasSupabaseConfig) return;
    localStorage.setItem('daryu-custom-gifts', JSON.stringify(customGifts));
  }, [customGifts]);

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) return;

    let mounted = true;

    async function loadCloudGifts() {
      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!mounted) return;

      if (error) {
        console.error(error);
        setCloudStatus('Нет доступа к Supabase. Проверь таблицу и правила.');
        return;
      }

      setCustomGifts((data || []).map((gift) => ({
        id: gift.id,
        title: gift.title,
        price: gift.price,
        emoji: gift.emoji || '🎁',
        recipients: gift.recipients || [],
        occasions: gift.occasions || [],
        interests: gift.interests || [],
        personalities: gift.personalities || [],
        tags: gift.tags || [],
        why: gift.why || 'Подарок, добавленный вручную.',
        shopUrl: gift.shop_url || '',
        ownerId: gift.owner_id,
        custom: true,
        fromSupabase: true
      })));
      setCloudStatus('Общая база Supabase включена');
    }

    async function initSupabase() {
      const { data: existingSession } = await supabase.auth.getSession();
      let user = existingSession?.session?.user;

      if (!user) {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) {
          console.error(error);
          setCloudStatus('В Supabase нужно включить Anonymous sign-ins');
          return;
        }
        user = data?.user;
      }

      if (mounted && user) setCurrentUserId(user.id);
      await loadCloudGifts();
    }

    initSupabase();

    const channel = supabase
      .channel('gifts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gifts' }, loadCloudGifts)
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const allGifts = useMemo(() => [...customGifts, ...GIFTS], [customGifts]);

  const results = useMemo(() => {
    const selectedInterests = form.interests;

    return allGifts.map((gift) => {
      let score = 0;
      if (form.recipient && (gift.recipients || []).includes(form.recipient)) score += 35;
      if (form.occasion && (gift.occasions || []).includes(form.occasion)) score += 20;
      if (form.personality && (gift.personalities || []).includes(form.personality)) score += 12;
      score += selectedInterests.filter((interest) => (gift.interests || []).includes(interest)).length * 15;
      if (gift.price <= form.budget) score += 20;
      if (gift.price > form.budget) score -= Math.min(35, Math.ceil((gift.price - form.budget) / 350));
      return { ...gift, score };
    })
      .filter((gift) => gift.score > 15)
      .filter((gift) => !showFavoritesOnly || favorites.includes(gift.id))
      .sort((a, b) => b.score - a.score || a.price - b.price);
  }, [form, favorites, showFavoritesOnly, allGifts]);

  const best = results[0];

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function toggleInterest(interest) {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest]
    }));
  }

  function toggleFavorite(id) {
    setFavorites((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  }

  function splitList(value) {
    return value.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);
  }

  async function addGift(event) {
    event.preventDefault();

    if (!newGift.title.trim() || !newGift.price) {
      alert('Добавь хотя бы название и цену подарка');
      return;
    }

    const gift = {
      title: newGift.title.trim(),
      price: Number(newGift.price),
      emoji: newGift.emoji.trim() || '🎁',
      recipients: splitList(newGift.recipients),
      occasions: splitList(newGift.occasions),
      interests: splitList(newGift.interests),
      personalities: splitList(newGift.personalities),
      tags: splitList(newGift.tags),
      why: newGift.why.trim() || 'Подарок, добавленный вручную.',
      shopUrl: newGift.shopUrl.trim(),
      custom: true,
      ownerId: currentUserId || 'local'
    };

    try {
      if (hasSupabaseConfig && supabase && currentUserId) {
        const { error } = await supabase.from('gifts').insert({
          title: gift.title,
          price: gift.price,
          emoji: gift.emoji,
          recipients: gift.recipients,
          occasions: gift.occasions,
          interests: gift.interests,
          personalities: gift.personalities,
          tags: gift.tags,
          why: gift.why,
          shop_url: gift.shopUrl,
          owner_id: currentUserId
        });

        if (error) throw error;
      } else {
        setCustomGifts((prev) => [{ ...gift, id: `custom-${Date.now()}` }, ...prev]);
      }

      setNewGift({
        title: '',
        price: '',
        emoji: '🎁',
        recipients: '',
        occasions: '',
        interests: '',
        personalities: '',
        tags: '',
        why: '',
        shopUrl: ''
      });
    } catch (error) {
      console.error(error);
      alert('Не получилось добавить подарок. Проверь Supabase или интернет.');
    }
  }

  async function deleteCustomGift(gift) {
    if (gift.fromSupabase && gift.ownerId !== currentUserId) {
      alert('Удалять можно только подарки, которые добавила ты в этом браузере.');
      return;
    }

    try {
      if (gift.fromSupabase && supabase) {
        const { error } = await supabase
          .from('gifts')
          .delete()
          .eq('id', gift.id)
          .eq('owner_id', currentUserId);

        if (error) throw error;
      } else {
        setCustomGifts((prev) => prev.filter((item) => item.id !== gift.id));
      }
      setFavorites((prev) => prev.filter((item) => item !== gift.id));
    } catch (error) {
      console.error(error);
      alert('Не получилось удалить подарок.');
    }
  }

  async function copyLink() {
    const params = new URLSearchParams();
    if (form.recipient) params.set('recipient', form.recipient);
    if (form.occasion) params.set('occasion', form.occasion);
    if (form.budget) params.set('budget', String(form.budget));
    if (form.personality) params.set('personality', form.personality);
    if (form.interests.length) params.set('interests', form.interests.join(','));
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  function reset() {
    setForm({ recipient: '', occasion: '', budget: 5000, personality: '', interests: [] });
    setShowFavoritesOnly(false);
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="heroText">
          <div className="badge">🎁 умный подбор подарков</div>
          <h1>Дарю</h1>
          <p>Подбери подарок по человеку, поводу, бюджету и интересам — без мучительного “а что вообще дарить?”.</p>
          <div className="heroActions">
            <a href="#picker" className="primaryButton">Подобрать подарок</a>
            <button className="ghostButton" onClick={copyLink}>{copied ? 'Ссылка скопирована' : 'Поделиться подборкой'}</button>
          </div>
        </div>
        <div className="heroCard" aria-label="Лучший вариант подарка">
          <span className="spark">✨</span>
          <p>лучший вариант сейчас</p>
          <h2>{best ? best.title : 'Заполни анкету'}</h2>
          <strong>{best ? formatRub(best.price) : '—'}</strong>
        </div>
      </section>

      <section className="layout" id="picker">
        <aside className="panel">
          <div className="panelTitle">
            <span>⚙️</span>
            <h2>Анкета</h2>
          </div>

          <label>
            Кому подарок?
            <select value={form.recipient} onChange={(e) => updateField('recipient', e.target.value)}>
              <option value="">Не важно</option>
              {RECIPIENTS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>

          <label>
            Повод
            <select value={form.occasion} onChange={(e) => updateField('occasion', e.target.value)}>
              <option value="">Не важно</option>
              {OCCASIONS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>

          <label>
            Бюджет: <b>{formatRub(form.budget)}</b>
            <input
              type="range"
              min="500"
              max="15000"
              step="500"
              value={form.budget}
              onChange={(e) => updateField('budget', Number(e.target.value))}
            />
          </label>

          <label>
            Характер человека
            <select value={form.personality} onChange={(e) => updateField('personality', e.target.value)}>
              <option value="">Не важно</option>
              {PERSONALITIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>

          <div className="chipsBlock">
            <p>Интересы</p>
            <div className="chips">
              {INTERESTS.map((interest) => (
                <button
                  type="button"
                  key={interest}
                  className={form.interests.includes(interest) ? 'chip active' : 'chip'}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="smallActions">
            <button onClick={() => setShowFavoritesOnly((value) => !value)} className="secondaryButton">
              {showFavoritesOnly ? 'Показать все' : 'Только избранное'}
            </button>
            <button onClick={reset} className="textButton">Сбросить</button>
          </div>
        </aside>

        <div className="contentColumn">
          <div className="topActionsBar">
            <button
              type="button"
              className="addGiftToggle"
              onClick={() => setShowAddGiftForm((value) => !value)}
            >
              {showAddGiftForm ? 'Скрыть форму' : '+ Добавить подарок'}
            </button>
          </div>

          {showAddGiftForm && (
            <section className="addGiftBox">
              <div className="addGiftHeader">
                <div>
                  <p>Своя база</p>
                  <h2>Добавить подарок</h2>
                </div>
                <span>➕</span>
              </div>
              <p className="addGiftHint">{hasSupabaseConfig ? 'Подарки сохраняются в общей Supabase-базе и видны другим пользователям.' : 'Сейчас локальный режим: добавь Supabase-ключи в .env, чтобы подарки были общими.'}</p>
              <div className={hasSupabaseConfig ? 'statusPill online' : 'statusPill'}>{cloudStatus}</div>

              <form onSubmit={addGift} className="addGiftForm">
                <input value={newGift.title} onChange={(e) => setNewGift({ ...newGift, title: e.target.value })} placeholder="Название подарка" />
                <input value={newGift.price} onChange={(e) => setNewGift({ ...newGift, price: e.target.value })} placeholder="Цена, ₽" type="number" min="0" />
                <input value={newGift.emoji} onChange={(e) => setNewGift({ ...newGift, emoji: e.target.value })} placeholder="Эмодзи, например 🌿" />
                <input value={newGift.shopUrl} onChange={(e) => setNewGift({ ...newGift, shopUrl: e.target.value })} placeholder="Ссылка на магазин" />
                <input value={newGift.recipients} onChange={(e) => setNewGift({ ...newGift, recipients: e.target.value })} placeholder="Кому: маме, дедушке" />
                <input value={newGift.occasions} onChange={(e) => setNewGift({ ...newGift, occasions: e.target.value })} placeholder="Поводы: день рождения, новый год" />
                <input value={newGift.interests} onChange={(e) => setNewGift({ ...newGift, interests: e.target.value })} placeholder="Интересы: дача, уют, техника" />
                <input value={newGift.personalities} onChange={(e) => setNewGift({ ...newGift, personalities: e.target.value })} placeholder="Характер: практичный, домашний" />
                <input value={newGift.tags} onChange={(e) => setNewGift({ ...newGift, tags: e.target.value })} placeholder="Теги: полезно, недорого" />
                <textarea value={newGift.why} onChange={(e) => setNewGift({ ...newGift, why: e.target.value })} placeholder="Почему это хороший подарок?" />
                <button type="submit">Добавить подарок</button>
              </form>
            </section>
          )}

          <section className="results">
          <div className="resultsHeader">
            <div>
              <p>Найдено вариантов</p>
              <h2>{results.length || 'Пока ничего'}</h2>
            </div>
            <button onClick={copyLink} className="copyButton">{copied ? '✓ Готово' : '🔗 Скопировать ссылку'}</button>
          </div>

          {results.length === 0 ? (
            <div className="empty">
              <span>💌</span>
              <h3>Подарок не нашёлся</h3>
              <p>Попробуй увеличить бюджет или выбрать меньше интересов.</p>
            </div>
          ) : (
            <div className="cards">
              {results.map((gift, index) => (
                <article className="giftCard" key={gift.id}>
                  <div className="giftTop">
                    <div className="emoji">{gift.emoji}</div>
                    <button
                      className={favorites.includes(gift.id) ? 'heart liked' : 'heart'}
                      onClick={() => toggleFavorite(gift.id)}
                      aria-label="Добавить в избранное"
                    >
                      ♥
                    </button>
                  </div>
                  <div className="match">совпадение {Math.max(35, Math.min(99, gift.score + 20))}%</div>
                  <h3>{index === 0 ? '⭐ ' : ''}{gift.title}</h3>
                  <p>{gift.why}</p>
                  <div className="tags">
                    {(gift.tags || []).map((tag) => <span key={tag}>{tag}</span>)}
                    {gift.custom && <span>добавлено тобой</span>}
                  </div>
                  <div className="giftActions">
                    {gift.shopUrl && (
                      <a className="shopButton" href={gift.shopUrl} target="_blank" rel="noreferrer">В магазин</a>
                    )}
                    {gift.custom && (
                      <button className="deleteButton" onClick={() => deleteCustomGift(gift)}>Удалить</button>
                    )}
                  </div>
                  <div className="cardBottom">
                    <strong>{formatRub(gift.price)}</strong>
                    <span>{gift.price <= form.budget ? 'в бюджете' : 'выше бюджета'}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
          </section>
        </div>
      </section>

      <section className="mvp">
        <h2>MVP проекта</h2>
        <div className="mvpGrid">
          <div><b>1</b><p>Анкета: кому, повод, бюджет, характер, интересы.</p></div>
          <div><b>2</b><p>Алгоритм подбора подарков по совпадениям.</p></div>
          <div><b>3</b><p>Карточки подарков с ценой, причиной и тегами.</p></div>
          <div><b>4</b><p>Избранное в браузере пользователя.</p></div>
          <div><b>5</b><p>Ссылка на подборку, которую можно отправить другому человеку.</p></div>
          <div><b>6</b><p>Кнопки “В магазин” для перехода к покупке.</p></div>
          <div><b>7</b><p>Добавление своих подарков в общую Supabase-базу.</p></div>
          <div><b>8</b><p>Адаптивный дизайн для телефона и компьютера.</p></div>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
