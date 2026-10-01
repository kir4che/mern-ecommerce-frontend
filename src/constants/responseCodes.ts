type ErrorMapValue = string | ((data: Record<string, unknown>) => string);

export const RESPONSE_CODE_MAP: Record<string, ErrorMapValue> = {
  // ── 認證、權限 ──
  NOT_AUTHENTICATED: "請先登入後再繼續",
  FORBIDDEN: "您目前無法執行這項操作",
  ACCESS_TOKEN_REQUIRED: "請先登入後再繼續",
  INVALID_ACCESS_TOKEN: "登入已過期，請重新登入",
  TOKEN_EXPIRED: "登入已過期，請重新登入",
  INVALID_REFRESH_TOKEN: "登入狀態異常，請重新登入",
  REFRESH_TOKEN_EXPIRED: "登入已過期，請重新登入",
  REFRESH_TOKEN_REQUIRED: "登入資訊不足，請重新登入",
  INVALID_CREDENTIALS: "帳號或密碼不正確，請重新輸入。",

  // ── 會員 ──
  USER_ALREADY_EXISTS: "此 Email 已經註冊過，請直接登入。",
  USER_NOT_FOUND: "找不到此會員資料",
  WEAK_PASSWORD: "密碼需包含大小寫英文及數字，且至少 8 字元。",
  EMAIL_REQUIRED: "請輸入 Email",
  LOGIN_FIELDS_REQUIRED: "請輸入 Email 與密碼",
  PASSWORD_FIELDS_REQUIRED: "請填寫所有密碼欄位",
  INVALID_CURRENT_PASSWORD: "目前密碼不正確",
  INVALID_RESET_TOKEN: "重設密碼連結無效或已過期，請重新申請。",
  RESET_PASSWORD_COOLDOWN: "請稍候再發送重設密碼信件",
  INVALID_EMAIL: "Email 格式不正確",

  // ── 地址 ──
  ADDRESS_FIELDS_REQUIRED: "請填寫所有地址必填欄位",
  INVALID_ADDRESS_ID: "地址資料有誤，請重新整理後再試",
  ADDRESS_NOT_FOUND: "找不到此地址",

  // ── 購物車 ──
  CART_ITEM_FIELDS_REQUIRED: "請先選擇商品與數量",
  INVALID_QUANTITY: "數量必須是正整數，請重新輸入。",
  INVALID_LOCAL_CART_DATA: "購物車資料格式有誤，請重新加入商品。",
  INVALID_LOCAL_CART_ITEM: "購物車商品資料有誤，請重新加入商品。",
  CART_ITEM_NOT_FOUND: "找不到指定的購物車商品，請重新整理後再試。",
  CART_NOT_FOUND: "找不到您的購物車，請重新整理頁面。",

  // ── 商品 ──
  PRODUCT_ID_REQUIRED: "缺少商品編號，請重新操作",
  PRODUCT_DATA_REQUIRED: "請填寫完整商品資料",
  PRODUCT_NOT_FOUND: "找不到此商品",
  PRODUCT_OUT_OF_STOCK: "此商品已售完",
  INVALID_PRODUCT_ID: "商品資料有誤，請重新整理後再試。",
  INVALID_PRODUCT_IDS: "商品資料有誤，請重新選擇商品。",
  INVALID_PRODUCT_UPDATE_DATA: "請提供要更新的商品內容",
  OUT_OF_STOCK: (data: Record<string, unknown>) =>
    `商品「${data?.productTitle || ""}」庫存不足，目前僅剩 ${data?.availableQuantity || 0} 件，無法購買 ${data?.requestedQuantity || 0} 件。請調整購買數量或選擇其他商品。`,

  // ── 優惠碼 ──
  COUPON_FIELDS_REQUIRED: "請完整填寫優惠碼資料欄位",
  COUPON_CODE_REQUIRED: "請先輸入優惠碼",
  COUPON_NOT_FOUND: "找不到此優惠碼",
  COUPON_NOT_ACTIVE: "此優惠碼目前未啟用",
  COUPON_EXPIRED: "優惠碼已過期",
  COUPON_CODE_ALREADY_EXISTS: "此優惠碼已存在，請使用其他代碼。",
  COUPON_MIN_PURCHASE_NOT_MET: "尚未達到優惠碼的最低消費門檻",
  INVALID_DISCOUNT_TYPE: "優惠類型錯誤，請重新確認",
  INVALID_DISCOUNT_VALUE: "折扣數值無效，請重新輸入",
  INVALID_MIN_PURCHASE_AMOUNT: "最低消費金額不可小於 0",
  INVALID_EXPIRY_DATE: "優惠碼到期日格式不正確",
  INVALID_COUPON_ID: "優惠碼編號格式錯誤",
  INVALID_COUPON_DISCOUNT_AMOUNT: "優惠碼折扣金額無效",
  INVALID_SUBTOTAL: "訂單金額格式錯誤，請重新整理後再試。",
  COUPON_UPDATED: "優惠碼已更新。",

  // ── 訂單 ──
  ORDER_ITEMS_REQUIRED: "訂單中需要包含至少一項商品",
  INVALID_ORDER_ITEMS: "訂單商品資料有誤，請重新確認。",
  INVALID_ORDER_ID: "訂單資料有誤，請重新整理後再試。",
  ORDER_NOT_FOUND: "找不到此筆訂單",
  ORDER_CANNOT_CANCEL: "只有尚未出貨的訂單可以取消",
  ORDER_CANNOT_PAY: "此訂單目前無法付款",
  ORDER_CANNOT_SHIP: "只有已付款且待出貨的訂單可以出貨",
  ORDER_CANNOT_COMPLETE: "只有已送達的訂單可以完成",
  ORDER_STATUS_TRANSITION_UNSUPPORTED: "此訂單狀態轉換目前不支援",
  INVALID_SHIPPING_TRACKING_NO: "請輸入有效的物流單號",
  ORDER_CANNOT_MODIFY: "此訂單已處理完成，無法修改內容",
  ORDER_EXPIRED: "此訂單已過期，無法付款",
  ORDER_ALREADY_PAID: "此訂單已付款",
  ORDER_UPDATE_FORBIDDEN: "您無法修改這筆訂單",
  ORDER_VIEW_FORBIDDEN: "您無法查看這筆訂單",
  ORDER_PAYMENT_FORBIDDEN: "您無法為這筆訂單付款",
  INVALID_PAYMENT_REQUEST: "付款資料有誤，請重新確認後再試。",

  // ── 分類 ──
  CATEGORY_FIELDS_REQUIRED: "請填寫分類名稱與 Slug",
  CATEGORY_SLUG_EXISTS: "此分類 Slug 已存在，請使用其他名稱",
  INVALID_CATEGORY_ID: "分類資料有誤，請重新整理後再試。",
  CATEGORY_NOT_FOUND: "找不到此分類",

  // ── 標籤 ──
  TAG_FIELDS_REQUIRED: "請填寫標籤名稱與 Slug",
  TAG_SLUG_EXISTS: "此標籤 Slug 已存在，請使用其他名稱",
  INVALID_TAG_ID: "標籤資料有誤，請重新整理後再試。",
  TAG_NOT_FOUND: "找不到此標籤",

  // ── 最新消息 ──
  INVALID_NEWS_ID: "最新消息資料有誤，請重新整理後再試。",
  INVALID_NEWS_UPDATE_DATA: "請提供要更新的最新消息內容",
  NEWS_NOT_FOUND: "找不到這則最新消息",

  // ── 上傳 ──
  IMAGE_FILE_REQUIRED: "請先選擇要上傳的圖片",

  // ── Rate Limit ──
  RATE_LIMIT_EXCEEDED: "請求過於頻繁，請稍後再試。",
  AUTH_RATE_LIMIT_EXCEEDED: "嘗試次數過多，請稍後再試。",
  COUPON_RATE_LIMIT_EXCEEDED: "優惠碼驗證次數過多，請稍後再試。",
  CONTACT_RATE_LIMIT_EXCEEDED: "聯絡表單送出次數過多，請稍後再試。",

  // ── 通用 ──
  NOT_FOUND: "找不到要求的資源",
  INTERNAL_SERVER_ERROR: "系統忙碌中，請稍後再試。",
  PAYMENT_CONFIG_MISSING: "付款設定不完整，請稍後再試或聯絡客服。",
  NO_UPDATE_DATA: "未提供任何要更新的資料",
  MISSING_FIELDS: "請填寫所有必填欄位",
  INSUFFICIENT_STOCK: "庫存不足，請調整購買數量。",
  DEV_ENDPOINT_DISABLED: "此功能僅開放開發環境使用",

  // ── 成功訊息 ──
  USER_REGISTERED: "註冊成功，請登入會員帳戶。",
  USER_LOGGED_OUT: "已成功登出。",
  PASSWORD_UPDATED: "密碼已更新，請重新登入。",
  ADDRESS_DELETED: "地址已刪除。",
  CART_ITEM_REMOVED: "商品已從購物車移除。",
  CART_CLEARED: "購物車已清空。",
  CART_UPDATED: "購物車已更新。",
  ORDER_CREATED: "訂單已成功建立。",
  ORDER_ALREADY_EXISTS: "此訂單已存在。",
  ORDER_CANCELED: "訂單已取消。",
  CONTACT_MESSAGE_SENT: "訊息已送出，我們會盡快回覆您。",
  NEWS_UPDATED: "最新消息已更新。",
  PAYMENT_SIMULATED: "付款模擬成功。",
  IMAGE_UPLOADED: "圖片已上傳成功。",
} as const;
