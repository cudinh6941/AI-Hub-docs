---
title: "Product R&D Roadmap & Feature Tracking"
created: 2026-10-16
updated: 2026-10-16
tags:
  - dashboard
  - roadmap
---

# 🚀 AI Hub Docs — Product R&D Roadmap

Bảng điều khiển Dataview tự động theo dõi vòng đời phát triển tính năng từ lúc hình thành ý tưởng, biên soạn bản vẽ thiết kế (Spec), thực thi qua Subagents cho đến khi phát hành.

---

## 💡 1. Ideas Inbox (Hộp Thư Ý Tưởng)
> *Các ý tưởng mới đang được gom nhặt từ người dùng, phòng ban hoặc R&D.*

```dataview
TABLE id AS "ID", title AS "Tiêu Đề", priority AS "Ưu Tiên", created AS "Ngày Tạo"
FROM "0-ideas-inbox" OR "product/0-ideas-inbox"
SORT choice(priority = "high", 1, choice(priority = "medium", 2, 3)) ASC
```

---

## 📐 2. Specs Backlog (Bản Vẽ Sẵn Sàng Thực Thi)
> *Các tính năng đã được thiết kế kiến trúc đầy đủ (`status: spec-ready`), sẵn sàng kích hoạt lệnh CLI `npm run agy:spec`.*

```dataview
TABLE id AS "ID", title AS "Tính Năng", priority AS "Ưu Tiên", target_agents AS "Subagents", created AS "Ngày Tạo"
FROM "1-specs-backlog" OR "product/1-specs-backlog"
WHERE status = "spec-ready"
SORT choice(priority = "high", 1, choice(priority = "medium", 2, 3)) ASC
```

---

## ⚡ 3. In Progress (Đang Thực Thi Qua Subagents)
> *Các tính năng đang trong pipeline thực thi: `1-data-architect` ➔ `2-ui-developer` ➔ `3-qa-verifier`.*

```dataview
TABLE id AS "ID", title AS "Tính Năng", priority AS "Ưu Tiên", target_agents AS "Subagents", file.mtime AS "Cập Nhật"
FROM "2-in-progress" OR "product/2-in-progress"
SORT file.mtime DESC
```

---

## 📦 4. Shipped Archive (Tính Năng Đã Phát Hành)
> *Lịch sử các tính năng đã vượt qua kiểm thử QA và chính thức tích hợp vào sản phẩm.*

```dataview
TABLE id AS "ID", title AS "Tính Năng", priority AS "Ưu Tiên", file.mtime AS "Ngày Xuất Bản"
FROM "3-shipped-archive" OR "product/3-shipped-archive"
SORT file.mtime DESC
```
