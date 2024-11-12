

要实现在第一个页面中的方法 `onClick` 调用第二个页面中的 `updateBankToUser` 方法，我们可以使用事件总线来实现跨组件通信。在Vue 3中，我们可以使用 `mitt` 库来创建事件总线。

首先，安装 `mitt` 库：
```bash
npm install mitt
```

然后，我们可以创建一个全局的事件总线，并在第二个页面中将 `updateBankToUser` 方法注册为一个事件处理程序，然后在第一个页面的 `onClick` 方法中触发这个事件，从而调用第二个页面中的方法。

以下是示例代码：

**创建全局事件总线 bus.ts：**
```ts
// bus.ts
import mitt from 'mitt';

export const bus = mitt();
```

**第二个页面 user.vue：**
```vue
<template>
  <div>
    <!-- ...其他代码... -->
    <el-button @click="updateBankToUser">更新银行的用户</el-button>
  </div>
</template>

<script setup>
import { bus } from './bus';

const updateBankToUser = async () => {
  console.log('更新银行的用户');
  // 在这里执行您的业务逻辑
}
bus.on('callUpdateBankToUser', updateBankToUser);
</script>
```

**第一个页面 parent.vue：**
```vue
<template>
  <div>
    <el-button @click="onClick">点击调用第二个页面的方法</el-button>
  </div>
</template>

<script setup>
import { bus } from './bus';

const onClick = () => {
  console.log('调用第二个页面的方法');
  // 在这里执行您的业务逻辑
  bus.emit('callUpdateBankToUser');
}
</script>
```

在这个示例中，我们在 bus.ts 中创建了一个全局事件总线 `bus`。然后在第二个页面 user.vue 中，我们将 `updateBankToUser` 方法注册为名为 'callUpdateBankToUser' 的事件处理程序。在第一个页面 parent.vue 中的 `onClick` 方法中，我们使用 `bus.emit` 触发了 'callUpdateBankToUser' 事件，从而调用了第二个页面中的 `updateBankToUser` 方法。

通过这种方式，您可以在不直接引用第二个页面的情况下，实现跨组件调用其中的方法。





## 什么是全局事件总线bus.ts import mitt from 'mitt'; export const bus = mitt(); 两行的作用是啥

在这里，`bus.ts` 文件中的两行代码用来创建全局事件总线。全局事件总线是一个简单的事件管理器，它可以用于在应用程序中实现组件之间的通信，特别是当组件之间没有直接父子关系时。

具体来说，这两行代码的作用是：

1. `import mitt from 'mitt';`: 这里我们导入了 `mitt` 库，它是一个简单、小巧的 JavaScript 事件库。`mitt` 库允许我们创建事件总线，以便在应用程序的任何地方都可以访问该事件总线。

2. `export const bus = mitt();`: 在这里，我们创建了一个全局的事件总线 `bus` 并将其导出。通过 `mitt()` 调用，我们创建了一个新的事件总线实例，可以用来管理事件的注册、触发和取消。

总结起来，`bus.ts` 文件中的这两行代码的目的是创建一个全局的事件总线，以便在应用程序的任何地方都可以使用它进行组件之间的通信。通过这个全局事件总线，我们可以在不直接引用其他组件的情况下，实现组件之间的方法调用和数据传递。

