from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_todo():
    response = client.post(
        "/todos",
        json={"title":"テスト用タスク", "is_completed": False}
    )
    assert response.status_code == 200

    data = response.json()
    assert data["title"] == "テスト用タスク"
    assert data["is_completed"] == False
    assert "id" in data

# --- (既存の test_create_todo の下に追記します) ---

def test_read_todos():
    """
    タスク一覧が正しく取得できるかをテストする
    """
    response = client.get("/todos")
    
    # 成功すること（ステータス200）と、リスト（配列）が返ってくることを確認
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_todo():
    """
    タスクの更新（タイトル変更・チェック）ができるかをテストする
    """
    # 1. まず、テスト用のタスクを1つ作る
    create_response = client.post(
        "/todos",
        json={"title": "更新前のタスク", "is_completed": False}
    )
    todo_id = create_response.json()["id"] # 作られたタスクのIDを取得

    # 2. そのIDを指定して、更新（PUT）リクエストを送る
    update_response = client.put(
        f"/todos/{todo_id}",
        json={"title": "更新後のタスク", "is_completed": True} # タイトルと状態を変更
    )
    
    # 3. 正しく更新されたかチェック
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["title"] == "更新後のタスク"
    assert data["is_completed"] == True

def test_delete_todo():
    """
    タスクが正しく削除できるかをテストする
    """
    # 1. まず、削除用のタスクを1つ作る
    create_response = client.post(
        "/todos",
        json={"title": "消される運命のタスク", "is_completed": False}
    )
    todo_id = create_response.json()["id"]

    # 2. そのIDを指定して、削除（DELETE）リクエストを送る
    delete_response = client.delete(f"/todos/{todo_id}")
    
    # 3. 削除成功のメッセージが返ってくるかチェック
    assert delete_response.status_code == 200
    assert delete_response.json() == {"message": "削除しました"}