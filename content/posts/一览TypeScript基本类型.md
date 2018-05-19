---
title: "一览TypeSCript基本类型"
date: 2018-05-19
tags: ['typescript']
---

#### 基本类型

TypeScript的基本类型有：**boolean**、**number**、**string**、**null**、**undefined**、**any**等，any代表不确定的类型，不会触发类型检测，它们可以用于指定JavaScript变量的类型：

```
const test: string = 'vv13'
```

#### 函数类型

类型系统可以用来定义函数参数与返回值的类型：

```
function test(arg1: number): string { return number > 60 ? 'good' : 'bad' }
```

函数还有其他两种类型：

- **void**：不属于任何类型。函数若没有返回值，可以用void指代：`function test(): void {}`
- **never**：代表函数不会执行完成，如抛出错误、死循环等 (event lop)：`function test(): never { while(true) {} }`

#### 数组类型

数组类型有两种定义的方式（recommend 1）:

1. `let test: number[] = [1, 2, 3]`
2. `let test: Array<number> = [1, ,2 ,3]`

#### 元组Tuple

元组用于定义固定个数不同类型的集合：

```
let tuple: [string, number] = ['11', 2] // true
let tuple: [string, number] = ['11', '2'] // false
let tuple: [string, number] = ['11', 2, '11'] // true
```

当元素索引超出定义范围的时候，将使用联合类型 ，即只要符合元组定义的类型之一即可。

#### 枚举Enum

枚举类型用于限定数值类型的定义，提供给集合列表一个友好的访问名称，我们可以用如下形式定义一个枚举：

```
enum Season { Spring, Summer, Autumn, Winter = 5 }
```

枚举类型默认从0开始排列，我们也可以给枚举项名称特定的值，枚举不仅可以获取枚举的值，也可以通过枚举值直接获取枚举项名称：

```
Season.Spring // 0
Season[5] // Winter
```

#### 断言assertions

断言像是在告诉编译器，我比你更能明白这个值的类型，编译器就会按照指定的类型来处理变量，断言依然有两种形式(recommend 'as')：

```
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
let strLength: number = (someValue as string).length;
```

断言不会执行特殊检查与重构数据，也没有任何运行时的影响，它只是假设使用者已经完成了类型检测。
