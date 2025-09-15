# AC-CCM
写了一个 markdown 渲染功能，有新数据集就写一个 markdown 就好。
## 简介
- 提供统一的下载链接与校验信息
- 说明数据划分与使用协议
- 演示如何插入图片、表格与代码

## 下载
- 数据集主页: https://example.com
- 直链: https://example.com/download/demo2.zip
- SHA256: `0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef`

## 数据规模
| 子集  | 条目数 | 说明   |
| ----- | -----: | ------ |
| train | 10,000 | 训练集 |
| valid |  2,000 | 验证集 |
| test  |  3,000 | 测试集 |

## 使用示例
```bash
python train.py --dataset demo2 --epochs 100
```

## 致谢
若使用此数据集，请在论文中引用对应的文献。
