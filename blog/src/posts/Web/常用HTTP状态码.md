---
title: 常用HTTP状态码
date: 2019-03-11
tags: ['Web']
---

> from @nestjs/common/enums/http-status.enum.d.ts

```
export declare enum HttpStatus {
    // 这一类型的状态码，代表请求已被接受，需要继续处理，通常由客户端进行接收处理，并采取其它行动
    CONTINUE = 100, // 请求者应当继续提出请求，服务端只接收到请求的一部分
    SWITCHING_PROTOCOLS = 101, // 切换协议请求，服务端已确认并准备切换
    PROCESSING = 102,

    // 成功，这类状态码代表请求已成功被服务器接收、理解、并接受
    OK = 200, // 完成，服务器已成功处理请求
    CREATED = 201, // 创建成功，并且服务器创建了新的资源
    ACCEPTED = 202, // 已接受请求，但尚未处理
    NON_AUTHORITATIVE_INFORMATION = 203, // 未授权信息，已成功处理请求，但返回的信息可能来自另一端
    NO_CONTENT = 204, // 无内容，服务端没有返回任何内容
    RESET_CONTENT = 205, // 重置内容，没有返回任何内容
    PARTIAL_CONTENT = 206, // 部分内容，服务器成功处理了部分GET请求

    // 重定向，这类状态码代表需要客户端采取进一步的操作才能完成请求
    AMBIGUOUS = 300, // 多种选择，被请求的资源有一系列可供选择的信息，用户或浏览器可自行选择一个首选地址进行重定向
    MOVED_PERMANENTLY = 301, // 永久重定向，被请求的资源已永久移动到新位置，返回的信息会包括新的URI，浏览器会自动重定向到新的URI
    FOUND = 302, // 临时重定向，客户端应继续使用原有URI
    SEE_OTHER = 303, // 查看其它地址
    NOT_MODIFIED = 304, // 未修改，所请求的资源未修改，服务器返回此状态码时，不会返回任何资源。客户端通常会缓存访问过的资源，通过提供一个头信息指出客户端希望只返回在指定日期之后修改的资源
    TEMPORARY_REDIRECT = 307, // 临时重定向
    PERMANENT_REDIRECT = 308, // 请求和所有将来的请求应该使用另一个URI重复
    // 请求错误
    BAD_REQUEST = 400, // 错误请求，服务器不理解请求的参数
    UNAUTHORIZED = 401, // 未授权，请求需要身份验证
    PAYMENT_REQUIRED = 402, //
    FORBIDDEN = 403, // 禁止，服务器拒绝请求，通常是权限不足
    NOT_FOUND = 404, // 未找到，服务器找不到请求的资源
    METHOD_NOT_ALLOWED = 405, // 方法禁止，服务器禁用请求中指定的方法
    NOT_ACCEPTABLE = 406, // 不接受，无法使用请求的内容特性相应请求的网页
    PROXY_AUTHENTICATION_REQUIRED = 407, // 需要代理授权，与401类似，但要求请求者授权使用代理
    REQUEST_TIMEOUT = 408, // 请求超时，服务器等候请求时发生超时
    CONFLICT = 409, // 冲突，服务器在完成请求时发生冲突，在相应中应包含有关冲突信息
    GONE = 410, // 已删除，如果请求的资源已永久删除，服务器会返回此相应
    LENGTH_REQUIRED = 411, // 需要有效长度，服务器不接受不含有效内容长度标头字段的请求
    PRECONDITION_FAILED = 412, // 未满足前提条件，服务器未满足请求中设置的一个前置条件
    PAYLOAD_TOO_LARGE = 413, // 请求实体过大，超过了服务器的处理能力
    URI_TOO_LONG = 414, // 请求的URI过长
    UNSUPPORTED_MEDIA_TYPE = 415, // 不支持的媒体类型
    REQUESTED_RANGE_NOT_SATISFIABLE = 416, // 请求范围不符合要求，服务器无法提供请求的范围
    EXPECTATION_FAILED = 417, // 未满足期望值，请求头不满足服务器的“期望”
    UNPROCESSABLE_ENTITY = 422, // 不可处理的实体，请求格式正确，但是含有语义错误，无法响应
    TOO_MANY_REQUESTS = 429, // 太多的请求，用户在给定的时间内发送了太多的请求

    // 服务器错误，表示服务器无法完成明显有效的请求
    INTERNAL_SERVER_ERROR = 500, // 服务器内部错误，服务器遇到了一个未曾预料的状况，导致了它无法完成对请求的处理
    NOT_IMPLEMENTED = 501, // 尚未实施，服务器不支持当前请求所需的某个功能
    BAD_GATEWAY = 502, // 错误网关，服务器作为网关或代理时，从上游服务器接收到无效响应，通常会在上游服务器发版本或服务终端时出现
    SERVICE_UNAVAILABLE = 503, // 服务不可用，服务器目前无法使用，通常指暂时状态。如果能够预测延迟时间，在响应中应包含Retry-After头
    GATEWAY_TIMEOUT = 504, // 网关超时，服务器作为网关或代理时，没有及时从上游服务器收到请求
    HTTP_VERSION_NOT_SUPPORTED = 505, // HTTP版本不受支持，服务器不支持请求中所用的HTTP协议版本

    // 特殊
    I_AM_A_TEAPOT = 418, // 我是一个茶壶！表示服务器拒绝冲泡咖啡，因为它是一个茶壶。
}
```
