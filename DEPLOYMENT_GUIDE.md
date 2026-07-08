# 🚀 TK Store - Deployment Guide

## ✅ রেডি অবস্থা

আপনার TK Store **সম্পূর্ণ রেডি** হোস্টিংয়ের জন্য!

- ✅ Supabase ডাটাবেজ কানেক্টেড
- ✅ ১০টি ডেমো অ্যাপ/গেম যোগ করা আছে
- ✅ অ্যাডমিন প্যানেল কাজ করছে (পাসওয়ার্ড: `TKStore.v2`)
- ✅ 3D UI ও অ্যানিমেশন রেডি

---

## 📦 হোস্টিং করার সময় যা লাগবে

### Environment Variable (অবশ্যই দিতে হবে)

```
DATABASE_URL=postgresql://postgres.vafccrffhgfmsddwpgej:TKS.OFFICIA@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
```

⚠️ **এই লাইনটা কপি করে রাখুন** — হোস্টিংয়ের সময় Environment Variables সেকশনে বসাতে হবে।

---

## 🌐 Vercel-এ ডিপ্লয় (সবচেয়ে সহজ)

### ধাপ ১: Vercel একাউন্ট
1. [vercel.com](https://vercel.com) এ যান
2. GitHub দিয়ে লগইন করুন

### ধাপ ২: প্রজেক্ট তৈরি
1. **"Add New Project"** এ ক্লিক করুন
2. আপনার GitHub repo সিলেক্ট করুন (অথবা কোড আপলোড করুন)

### ধাপ ৩: Environment Variable সেট করা
1. **"Environment Variables"** সেকশনে ক্লিক করুন
2. **"Add Variable"** এ ক্লিক করুন
3. Name: `DATABASE_URL`
4. Value: উপরের Supabase লিংকটা পেস্ট করুন
5. **Save** করুন

### ধাপ ৪: Deploy
1. **"Deploy"** বাটনে ক্লিক করুন
2. ২-৩ মিনিট অপেক্ষা করুন
3. ব্যাস! আপনার সাইট লাইভ 

---

## 🎯 হোস্টিংয়ের পর

### আপনার সাইটের URL পাবেন
- যেমন: `tk-store.vercel.app`
- এই URL যে কেউ যেকোনো মোবাইল/কম্পিউটার থেকে দেখতে পারবে

### অ্যাডমিন প্যানেল ব্যবহার
1. সাইটে যান → **Profile** ট্যাবে ক্লিক করুন
2. **RGB TK লোগো** তে ক্লিক করুন
3. পাসওয়ার্ড দিন: `TKStore.v2`
4. নতুন অ্যাপ/গেম যোগ করুন

### ছবি ও APK আপলোড
- ছবির জন্য: [Imgur.com](https://imgur.com) বা Supabase Storage ব্যবহার করুন
- APK ফাইলের জন্য: Google Drive, MediaFire, বা নিজের সার্ভার ব্যবহার করুন
- শুধু **লিংক** কপি করে অ্যাডমিন প্যানেলে বসান

---

## 🔧 অন্য হোস্টিং (Render, Railway, Netlify)

সব হোস্টিং-এই একই নিয়ম:

1. কোড আপলোড করুন
2. **Environment Variables** সেকশনে `DATABASE_URL` বসান
3. Deploy করুন

---

## 📞 সাহায্য দরকার হলে

কোনো সমস্যা হলে এই জিনিসগুলো চেক করুন:

- ✅ `DATABASE_URL` ঠিকমতো বসেছে কিনা
- ✅ Supabase প্রজেক্ট এক্টিভ আছে কিনা
- ✅ পাসওয়ার্ড িক আছে কিনা (`TKS.OFFICIA`)

---

**শুভকামনা আপনার TK Store এর জন্য!** 
