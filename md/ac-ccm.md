# AC-CCM
https://huggingface.co/datasets/catfishny/xishanqinkuang_test
## 1. 增加一个数据集的步骤
1. 往 `datasets.json` 文件中补全数据集信息
```json
{
    "datasets": [
        {
            "id": "ac-ccm",
            "name": "AC-CCM",
            "description": "AC-CCM 是首个专注于中国民乐意境识别的数据集，基于清代琴学经典《溪山琴况》的二十四况理论框架，涵盖多种乐器、时代与风格。",
            "image": "./asset/古琴.jpg",
            "imageAlt": "数据集示意图",
            "mdFile": "ac-ccm",
            "featured": true
        },
        {
            "id": "demo-dataset-2",
            "name": "音乐数据集2",
            "description": "专门用于语音识别和自然语言处理研究的数据集。",
            "image": "./asset/古琴.jpg",
            "imageAlt": "数据集示意图",
            "mdFile": "demo2",
            "featured": false
        },
        {
            "id": "demo-dataset-3",
            "name": "音乐数据集3",
            "description": "专门用于语音识别和自然语言处理研究的数据集。",
            "image": "./asset/古琴.jpg",
            "imageAlt": "数据集示意图",
            "mdFile": "demo3",
            "featured": false
        }
    ]
}
```
2. 新增对应的 markdown 文件
3. 网页会自动生成数据集资料卡片以及详情页

## 2. 下面是 markdown 渲染效果的示例
### 无序列表与超链接
- 数据集主页: https://huggingface.co/datasets/catfishny/xishanqinkuang_test
- SHA256: `0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef`

### 表格
| 子集  | 条目数 | 说明   |
| ----- | ------ | ------ |
| train | 10000  | 训练集 |
| valid | 2000   | 验证集 |
| test  | 3000   | 测试集 |

### 代码块
```bash
python train.py --dataset demo2 --epochs 100
```

## 图片
为避免显示大小问题，图片用 html 插入
```html
<img src="../asset/古琴.jpg" alt="示例图片" width="300" />
```
<img src="../asset/古琴.jpg" alt="示例图片" width="300" />

