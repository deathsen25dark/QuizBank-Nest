# Quiz Bank - NestJS API

Backend API cho hệ thống **Quiz Bank** được xây dựng bằng NestJS và MySQL.
API cung cấp các chức năng quản lý **Users, Topics, Questions** và **xác thực JWT**.

---

# 1. Cài đặt các package

```bash
npm install
```

Hoặc nếu bạn dùng pnpm / yarn:

```bash
pnpm install
# hoặc
yarn install
```

---

# 2. Cấu hình biến môi trường

Tạo file `.env` ở thư mục root và thêm các biến sau:

```env
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=quiz_bank

JWT_ACCESS_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_secret_key
```

Ví dụ:

```env
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=123456
DB_DATABASE=quiz_bank

JWT_ACCESS_SECRET=super_access_secret
JWT_REFRESH_SECRET=super_refresh_secret
```

⚠️ Lưu ý:  
Bạn cần chỉnh sửa thông tin **database** cho phù hợp với máy của mình.

---

# 3. Cấu hình DataSource
Nếu sử dụng migration, hãy đặt synchronize: false trong TypeOrmModule.forRoot ở file app.module.ts.
Nếu không sử dụng, bỏ qua mục này.

Kiểm tra file:

```
src/database/data-source.ts
```

Đảm bảo cấu hình kết nối database sử dụng đúng các biến trong `.env`.

Ví dụ:

```ts
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
});
```

---

# 4. Seed dữ liệu mẫu

Dự án có thể sử dụng **seed** để tạo dữ liệu ban đầu cho database.

Bạn có thể chỉnh sửa dữ liệu seed tại:

```
src/database/seed
```

Sau khi cấu hình database xong, chạy seed:

```bash
npm run seed
```

---

# 5. Cấu hình CORS

Để frontend có thể gọi API, cần cấu hình **CORS** trong file:

```
src/main.ts
```

Ví dụ:

```ts
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

---

# 6. Khởi chạy ứng dụng

```bash
npm run start:dev
```

Hoặc:

```bash
yarn start:dev
# hoặc
pnpm start:dev
```

Server sẽ chạy tại:

```
http://localhost:3001
```

---

# Công nghệ sử dụng

- **Framework:** NestJS  
- **Ngôn ngữ:** TypeScript  
- **ORM:** TypeORM  
- **Database:** MySQL  
- **Authentication:** JWT (Access Token & Refresh Token)  
- **Password Hashing:** bcryptjs 

---

# Các tính năng chính

- Xác thực người dùng (**Login / Register / Logout**)
- Phân quyền theo vai trò (**Teacher / Student**)
- Quản lý chủ đề (**CRUD Topics**)
- Quản lý câu hỏi (**CRUD Questions**)
- Tìm kiếm câu hỏi theo nội dung
- Phân trang danh sách câu hỏi
- Refresh Token để duy trì phiên đăng nhập