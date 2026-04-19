# Dockerfile
FROM python:3.12-slim

# 作業ディレクトリの設定
WORKDIR /app

# ライブラリのインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードのコピー
COPY . .

# 起動コマンド（8000番ポートで公開）
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]