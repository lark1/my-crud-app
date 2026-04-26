from pydantic import BaseModel, ConfigDict

#共通の属性
class TodoBase(BaseModel):
    title: str
    is_completed: bool = False

#作成時に必要なデータ
class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: str
    is_completed: bool
    
#読み取り時に返却されるデータ（IDが含まれる）
class Todo(TodoBase):
    id: int
    model_config = ConfigDict(from_attributes=True)