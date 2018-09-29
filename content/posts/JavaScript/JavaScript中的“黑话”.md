---
layout: post
title: JavaScript中的“黑话”
date: 2018-08-31
tags: ['JavaScript']
---

> 老司机也要翻车系列/恐吓外行集锦/装逼指南

## Operator

在JavaScript程序中，请一定要慎用位运算，再次被列为三大禁术之一！

### !!

将任意类型转为布尔型变量，以下是部分结果集：

```
// false
!!undefined
!!null
!!NaN
!!0
// true
!![]
!!{}
!!1
...
```

在实际项目中，也可使用单!，用于排除null、undefined、0等值。

### ~~

它代表双非按位运算符，如果你想使用比Math.floor()更快的方法，那就是它了。需要注意，对于正数，它向下取整；对于负数，向上取整；非数字取值为0，它具体的表现形式为：

```
~~null;      // => 0
~~undefined; // => 0
~~Infinity;  // => 0
--NaN;       // => 0
~~0;         // => 0
~~{};        // => 0
~~[];        // => 0
~~(1/0);     // => 0
~~false;     // => 0
~~true;      // => 1
~~1.9;       // => 1
~~-1.9;      // => -1
```

而一个~表示按位取反，如十进制5，以8位二进制表示：00000101，通过按位取反得：11111010，再取其反码：10000101，得其补码：10000110，因此~5 = -6，至于原码、反码、补码原理请看[以下章节](#原码, 反码, 补码)。

### +

在变量值前使用+的本意是将变量转换为数字，在一个函数接受数字类型的参数时特别有用：

```
+'1' // 1
+'-1' // '-1
+[] // 0
+{} // NaN
```

根据观察，`+a`与`a * 1`结果类似，使用+也可以产生一个立即执行函数：`+function() {}()`。

Vice Versa，将数字转为字符串的快捷方法也有：`'' + 1`。

### &, &&

请抛弃脑海中隐隐若现的理论： &会判断完所有条件是否成立，返回结果；而&&会判断第一个条件是否成立，若不成立，则直接返回结果了。

首先来说说&，它代表位运算的与，逻辑含义是两个条件都需要满足，来看一个示例：

```
10进制：7 & 3
转换为2进制： 111 & 11
比较结果：011
因此： 7 & 3 = 3
```

而对于&&，在条件判断中用于短路求值，返回第一个假值，也可用于赋值运算中，比如：`a = b.c && b.c.d`，这样可避免当c为undefined时，报Uncaught TypeError。

### |, ||

基本原理同上，在此也举一个例子：`1 | 2` alike `1 | 10` equal `11` ,因此1 | 2 = 3。

对于||，除了条件判断，也可用于默认值赋值，如： `a = b || 'something'`。

### == , ===

`==`为相等运算符，操作符会先将左右两边的操作数强制转型，转换为相同的操作数，再进行相等性比较。

`===`为全等运算符，它除了在比较时不会将操作数强制转型，其余相等判断与`==`一致。

简单而言，`==`用于判断值是否相等，`===`判断值与类型是否都相等，因此使用全等运算符判断操作数会更准确，新手也在学习JavaScript接收到的前几条Tips就是避免使用相等运算符，真的是这样吗？没错，这样能确保在你不彻底熟悉语言的情况下，尽可能的去避免犯错，但是我们也应该清楚在哪些情况下应该使用相等运算符，规则往往只针对于新手，而对聪明的你来说，最重要的是要清楚自己在做什么。

相等操作符对于不同类型的值，进行的比较如下图所示：

<table class="standard-table">
<thead>
<tr>
<th scope="row">&nbsp;</th>
<th colspan="7" style="text-align: center;" scope="col">B</th>
</tr>
</thead>
<tbody>
<tr>
<th scope="row">&nbsp;</th>
<td>&nbsp;</td>
<td style="text-align: center;">Undefined</td>
<td style="text-align: center;">Null</td>
<td style="text-align: center;">Number</td>
<td style="text-align: center;">String</td>
<td style="text-align: center;">Boolean</td>
<td style="text-align: center;">Object</td>
</tr>
<tr>
<th colspan="1" rowspan="6" scope="row">A</th>
<td>Undefined</td>
<td style="text-align: center;"><code>true</code></td>
<td style="text-align: center;"><code>true</code></td>
<td style="text-align: center;"><code>false</code></td>
<td style="text-align: center;"><code>false</code></td>
<td style="text-align: center;"><code>false</code></td>
<td style="text-align: center;"><code>IsFalsy(B)</code></td>
</tr>
<tr>
<td>Null</td>
<td style="text-align: center;"><code>true</code></td>
<td style="text-align: center;"><code>true</code></td>
<td style="text-align: center;"><code>false</code></td>
<td style="text-align: center;"><code>false</code></td>
<td style="text-align: center;"><code>false</code></td>
<td style="text-align: center;"><code>IsFalsy(B)</code></td>
</tr>
<tr>
<td>Number</td>
<td style="text-align: center;"><code>false</code></td>
<td style="text-align: center;"><code>false</code></td>
<td style="text-align: center;"><code>A === B</code></td>
<td style="text-align: center;"><code>A === ToNumber(B)</code></td>
<td style="text-align: center;"><code>A=== ToNumber(B) </code></td>
<td style="text-align: center;"><code>A=== ToPrimitive(B)</code></td>
</tr>
<tr>
<td>String</td>
<td style="text-align: center;"><code>false</code></td>
<td style="text-align: center;"><code>false</code></td>
<td style="text-align: center;"><code>ToNumber(A) === B</code></td>
<td style="text-align: center;"><code>A === B</code></td>
<td style="text-align: center;"><code>ToNumber(A) === ToNumber(B)</code></td>
<td style="text-align: center;"><code>ToPrimitive(B) == A</code></td>
</tr>
<tr>
<td>Boolean</td>
<td style="text-align: center;"><code>false</code></td>
<td style="text-align: center;"><code>false</code></td>
<td style="text-align: center;"><code>ToNumber(A) === B</code></td>
<td style="text-align: center;"><code>ToNumber(A) === ToNumber(B)</code></td>
<td style="text-align: center;"><code>A === B</code></td>
<td style="text-align: center;"><code>ToNumber(A) == ToPrimitive(B)</code></td>
</tr>
<tr>
<td>Object</td>
<td style="text-align: center;"><code>false</code></td>
<td style="text-align: center;"><code>false</code></td>
<td style="text-align: center;"><code>ToPrimitive(A) == B</code></td>
<td style="text-align: center;"><code>ToPrimitive(A) == B</code></td>
<td style="text-align: center;"><code>ToPrimitive(A) == ToNumber(B)</code></td>
<td style="text-align: center;">
<code>A === B</code>
</td>
</tr>
</tbody>
</table>

针对于undefined与null：**undefined与null互等，与其余任意对象都不相等**，因此在某些lib里，你可能会看到如下写法：

```
if (VAR == undefined) {}
if (VAR == null) {}
```

它等效于：

```
if (VAR === undefined || VAR === null) {}
```

对于 `'', false, 0`而言，他们都属于[Falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)类型，通过Boolean对象都会转换为假值，而通过`==`判断三者的关系，他们总是相等的，因为在比较值时它们会因为类型不同而都被转换为false值：

```
console.log((false == 0) && (0 == '') && ('' == false)) // true
```

或者有时候我们希望利用强转特性比较字符串与数字：

```
console.log(11 == '11') // true
console.log(11 === '11') // false
```

以上是使用相等运算符需要注意的一些用法，可以提一下的是，在JavaScript语言中，Falsy值有以下几种：

- false
- null
- undefined
- 0
- ''
- NaN
- document.all

document.all属于历史遗留原因，所以为false，它违背了JavaScript的规范，可以不管它，而NaN这个变量，千万不要用全等或相等对其进行判断，因为它发起疯来连自己都打：

```
console.log(NaN === 0) // false
console.log(NaN === NaN) // false
console.log(NaN == NaN) // false
```

但是我们可以使用Object.is方法进行判断值是否为NaN，它是ES6新加入的语法，用于比较两个值是否相同，它可以视为比全等判断符更为严格的判断方法，但是不可混为一谈：

```
Object.is(NaN, NaN) // true
Object.is(+0, -0) // false
```

### swap

两个数互相交换是一个很常见的操作，当然大家都希望每人都写这样的代码：`[a, b] = [b, a]`，可是世事总不如人意，你可能会遇到这样的异或运算：

```
// 异或运算，相同位取0，不同位取1，a ^ b ^ b = a， a ^ a ^ b = b
a = a ^ b
b = a ^ b
a = a ^ b
```

与异或运算思路相同，也可以使用加减法：

```
a = a + b
b = a - b
a = a - b
```

更有甚者，可能是这样的：

```
a = [b,b=a][0];
```

## Array

### shuffle

Array.prototype.sort()默认根据字符串的Unicode编码进行排序，具体算法取决于实现的浏览器，在[v8引擎](https://github.com/v8/v8/blob/b8a5ae4749be1b34246957982e205517737d814b/src/js/array.js#L545)中，若数组长度小于10则使用从插入排序，大于10使用的是快排。

而sort支持传入一个`compareFunction(a, b)`的参数，其中a、b为数组中进行比较的两个非空对象(所有空对象将会排在数组的最后)，具体比较规则为：

- 返回值小于0，a排在b的左边
- 返回值等于0，a和b的位置不变 
- 返回值大于0，a排在b的右边

因此利用sort即可写一个打乱数组的方法：

```
[1,2,3,4].sort(() => .5 - Math.random())
```

但是以上的实现并不是完全随机的，究其原因，还是因为排序算法的不稳定性，导致一些元素没有机会进行比较，具体请参考[问题](https://www.zhihu.com/question/68330851)，在抽奖程序中若要实现完全随机，请使用 **Fisher–Yates shuffle** 算法，以下是简单实现：

```
function shuffle(arrs) {
  for (let i = arrs.length - 1; i > 0; i -= 1) {
    const random = Math.floor(Math.random() * (i + 1));
    [arrs[random], arrs[i]] = [arrs[i], arrs[random]];
  }
}
```

### flatten

apply接收数组类型的参数来调用函数，而concat接收字符串或数组的多个参数，因此可使用此技巧将二维数组直接展平：

```
Array.prototype.concat.apply([], [1, [2,3], [4]])
```

而通过此方法也可以写一个深层次遍历的方法：

```
function flattenDeep(arrs) {
  let result = Array.prototype.concat.apply([], arrs);
  while (result.some(item => item instanceof Array)) {
    result = Array.prototype.concat.apply([], result);
  }
  return result;
}
```

经过测试，效率与lodash对比如下：

![](http://qn.vv13.cn/18-8-28/89073993.jpg)


## Object
### Object.prototype.toString.call

每个对象都有一个toString()，用于将对象以字符串方式引用时自动调用，如果此方法未被覆盖，toString则会返回[object type]，因此`Object.prototype.toString.call`只是为了调用原生对象上未被覆盖的方法，call将作用域指向需要判断的对象，为了获取最终的type。

在ES3中，获取到的type为[[Class]]属性，它可以用来判断一个原生属性属于哪一种内置的值；在ES5中新增了两条规则：若this值为null、undefined分别返回： [object Null]、[object Undefined]；在ES6中不存在[[Class]]了，取而代之的是一种内部属性：[[NativeBrand]]，它是一种标记值，用于区分原生对象的属性，具体的判断规则为：

```
19.1.3.6Object.prototype.toString ( )
When the toString method is called, the following steps are taken:

If the this value is undefined, return "[object Undefined]".
If the this value is null, return "[object Null]".
Let O be ! ToObject(this value).
Let isArray be ? IsArray(O).
If isArray is true, let builtinTag be "Array".
Else if O is a String exotic object, let builtinTag be "String".
Else if O has a [[ParameterMap]] internal slot, let builtinTag be "Arguments".
Else if O has a [[Call]] internal method, let builtinTag be "Function".
Else if O has an [[ErrorData]] internal slot, let builtinTag be "Error".
Else if O has a [[BooleanData]] internal slot, let builtinTag be "Boolean".
Else if O has a [[NumberData]] internal slot, let builtinTag be "Number".
Else if O has a [[DateValue]] internal slot, let builtinTag be "Date".
Else if O has a [[RegExpMatcher]] internal slot, let builtinTag be "RegExp".
Else, let builtinTag be "Object".
Let tag be ? Get(O, @@toStringTag).
If Type(tag) is not String, set tag to builtinTag.
Return the string-concatenation of "[object ", tag, and "]".
This function is the %ObjProto_toString% intrinsic object.

NOTE
Historically, this function was occasionally used to access the String value of the [[Class]] internal slot that was used in previous editions of this specification as a nominal type tag for various built-in objects. The above definition of toString preserves compatibility for legacy code that uses toString as a test for those specific kinds of built-in objects. It does not provide a reliable type testing mechanism for other kinds of built-in or program defined objects. In addition, programs can use @@toStringTag in ways that will invalidate the reliability of such legacy type tests.

```

### Object.create(null)

用于创建无“副作用”的对象，也就是说，它创建的是一个**空对象**，不包含原型链与其他属性。若使用`const map = {}`创建出来的对象相当于Object.create(Object.prototype)，它继承了对象的原型链。

### JSON.parse(JSON.stringify(Obj))

很常用的一种深拷贝对象的方式，将对象进行JSON字符串格式化再进行解析，即可获得一个新的对象，要注意它的性能不是特别好，而且无法处理闭环的引用，比如：

```
const obj = {a: 1};
obj.b = obj;
JSON.parse(JSON.stringify(obj)) // Uncaught TypeError: Converting circular structure to JSON
```

这样通过JSON解析的方式其实性能并不高，若对象可通过浅拷贝复制请一定使用浅拷贝的方式，不管你使用`{...obj}`还是`Object.assign({}, obj)`的方式，而如果对性能有要求的情况下，请不要再造轮子了，直接使用npm:clone这个包或是别的吧。

## 计算机基础

### 原码, 反码, 补码

在JavaScript进行位运算时，采用32位有符号整型，即数字5有以下表示方式：

- 原码：00000000 00000000 00000000 00000101
- 反码：00000000 00000000 00000000 00000101
- 补码：00000000 00000000 00000000 00000101

而数字-5的表示方式为：

- 原码：10000000 00000000 00000000 00000101
- 反码：11111111 11111111 11111111 11111010
- 补码：11111111 11111111 11111111 11111011

综上所述，有以下规律：

- 正数的原码、反码、补码都是它本身
- 负数的反码：在其原码的基础上, 符号位不变，其余各个位取反
- 负数的补码：负数的反码 + 1

那么它们到底有什么用呢？其实位运算就是用计算机底层电路所有运算的基础，为了让计算机的运算更加简单，而不用去辨别符号位，所有值都采用加法运算，因此，人们设计了原码，通过符号位来标识数字的正负：

```
1 = 0000 0001
-1 = 1000 0001
```

假如计算机要对两个数相加：1 + (-1)，使用原码相加的运算结果为：`10000010`，很明显-2并不是我们想要的结果，因此出现了反码，若使用反码进行运算会有什么结果呢，让我们来看一下：

```
1[反码] + (-1)[反码] =  0000 0001 + 1111 1110 = 11111111[反码] = 10000000[原码]
```

此时运算结果是正确的，可是这样还存在一个问题，有两个值可以表示0：1000 0000、0000 0000，对于计算机来说，0带符号是没有任何意义的，人们为了优化0的存在，设计出了补码：

```
1[补码] + (-1)[补码] =  0000 0001 + 1111 1111 = 00000000[原码]
```

这样一来，-0的问题就可以解决了。

> 未完待续...
