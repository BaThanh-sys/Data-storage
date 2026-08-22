# RobotVerse AI – Digital Showroom

Showroom kỹ thuật số giới thiệu các mô hình Robot AI hiện đại.  
Dự án thực hiện trong môn **Thiết kế Web**.

## Công nghệ sử dụng

- HTML5
- Tailwind CSS v4
- JavaScript thuần

## Cấu trúc thư mục

Data-storage/
├── src/
│   └── input.css          - Token màu + components
├── dist/
│   └── output.css         - File CSS đã build
├── js/
│   └── Script.js
├── index.html     - Trang chủ
├── pricing.html           - Trang bảng giá + so sánh
├── contact.html           - Trang liên hệ
└── README.md

## Cách Deploy

1. Build dự án :

npm run build
npx @tailwindcss/cli -i ./src/input.css -o ./dist/output.css

2. Kiểm tra quan trọng :

Mở thư mục dist → phải thấy file output.css.
Nếu không có file này → trang khi deploy sẽ bị trống

3. Commit & Push lên GitHub :
## Khởi tạo git nếu chưa có:

git init
git add .
git commit -m "feat: them trang gia va lien he, dark mode"
git branch -M main
git remote add origin https://github.com/Tên-GitHub-của-bạn/Tên-repo.git
git push -u origin main

## Commit & Push
git add .
git commit -m "comment của tôi"
git push


## Những gì cần làm ở buổi 3 :
1. Dán nội dung trên vào `README.md`
2. Lưu file
3. Kiểm tra lại 3 trang (`Robotverse-AI.html`, `pricing.html`, `contact.html`, `output.css`) xem đã chạy ổn chưa.



