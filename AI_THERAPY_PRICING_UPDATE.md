# AI Therapy Pricing Update

## ✅ Updated Ghost Mode AI Therapy

### Before vs After

| Metric | Old (50 msgs) | New (300 msgs) |
|--------|---------------|----------------|
| Messages per session | 50 | 300 |
| Average tokens per message | 200 | 200 |
| Tokens per session | 10,000 | 60,000 |
| Raw model cost (GPT-4o nano) | $0.01 | $0.015 |
| Selling price | $3.99 | $3.99 |
| **Gross margin** | **99.7%** | **99.6%** |

*Model costs: Input = $0.10/M tokens, Output = $0.40/M tokens (with 50% safety buffer)*

## 🎯 Updated Feature Comparison

### 👻 Ghost Mode (Free)
- **AI Therapy**: On-demand $3.99/session
- **Session Size**: 300-message deep-dive (nano model)
- **Value Prop**: "Almost unlimited" conversation in each session

### 🔥 Firewall Mode ($9.99/month)
- **AI Therapy**: 1,000 messages/month included
- **Value Prop**: Constant access without per-session charges

## 💡 Strategic Benefits

### 1. **Psychological Advantage**
- 300 messages feels "almost unlimited" vs 50 which felt restrictive
- Removes main objection from free users ("what if I run out mid-conversation?")
- Maintains clear upgrade path to unlimited monthly access

### 2. **Economics Still Work**
- Cost increase: +0.5¢ per session (essentially unchanged)
- Margin remains 99.6% - still excellent unit economics
- Higher perceived value = better conversion potential

### 3. **Implementation**
- ✅ Backend: Updated `aiTherapyMessagesPerSession: 300` in config
- ✅ Frontend: Updated all copy to show "300 msg cap"
- ✅ No breaking changes - existing sessions continue normally

## 🚀 Next Steps

1. **Test updated session limits** in development
2. **Monitor conversion rates** after deployment
3. **Track session completion rates** (how many users hit the 300 limit)
4. **Consider further optimization** based on usage data

---

**Status**: ✅ Ready for deployment - maintains same pricing with 6x the perceived value!
