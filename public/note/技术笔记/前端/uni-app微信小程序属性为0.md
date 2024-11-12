前几日在封装一个组件的时候，接收数据的时候遇到一个属性等于0，但是，前端死活不显示

![12a45f4c84a9207a4affd2e5c8eb0de](./assets/uni-app%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%B1%9E%E6%80%A7%E4%B8%BA0/12a45f4c84a9207a4affd2e5c8eb0de.png)

这里是有值的，但

![cad35a376e87b61ad1fc14a11ed0f73](./assets/uni-app%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%B1%9E%E6%80%A7%E4%B8%BA0/cad35a376e87b61ad1fc14a11ed0f73.png)

到了前端就没有了，卧槽，太神奇了是不是。打印一下看看

![894db17d9f789235f50d744953c9448](./assets/uni-app%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%B1%9E%E6%80%A7%E4%B8%BA0/894db17d9f789235f50d744953c9448.png)

打印出来传入值竟然是undefined而不是0，一定是闹鬼了。。。

最后再不断定位错误的时候，发现是这里的毛病

```vue
post: item.post || '', // 添加 post 属性，默认值为空字符串
```

原因是当数值为0的时候自己就默认是false

0在布尔上下文中被认为是假值，因此 `item.post||‘’`  会在 `item.post ` 为 0 时返回空字符串。所以说为了保留0，需要改成

```vue
 item.post !== undefined ? item.post : ''
```

来确保仅在 `item.post` 是 `undefined` 时返回空字符串。

下面贴一下源代码

```vue
<template>
	<view>
		<!-- 绑定个人信息 -->
		<u-popup :show="localBindCompShow" @close="onClickOverlayClose" @open="localBindCompShow =true" mode="center"
			round="20" :closeOnClickOverlay="true">
			<view class="bindCompCard">

				<view class="header-container">
					<view class='header-button'>
						<u-button type="info" size="5" icon="close" @click="onClickOverlayClose" :plain="true"
							:hairline="true"></u-button>
					</view>

					<view class="header-text">绑定企业信息</view>
					<u-tabs :list="bindCompTabList" @click="selectTab" class="tabs"></u-tabs>
				</view>

				<view v-if="!bindCompNewShow">
					<view class="supplier-container">
						<view v-for="(item, index) in itemsToDisplay" :key="index" class="supplier-card">
							<view class="supplier-details">
								<view class="company-name">{{ item.companyName }}</view>
								<view class="supplier-name">政采账号：{{ item.supplierAccessName }}</view>
							</view>
							<view class="bind-button">

								<view v-if="!item.isShow">
									<view class="post-select">
										{{ getPostText(item.post) }}
									</view>
									<button size="default" type="default"
										style="margin-top: 20rpx;color:#ffffff;background-color:#189f33;border-color:#ffffff;border-radius: 40rpx;height: 60rpx;display: flex;align-items: center;justify-content: center;">已绑定</button>
								</view>


								<view v-if="item.isShow">
									<view class="post-select" v-if="item.isShow">
										<uni-data-select v-model="item.post" :localdata="postList"
											placeholder="选择职位"></uni-data-select>
									</view>
									<button size="default" type="default" @click="submitBindCompCard(item)"
										style="margin-top: 20rpx;color:#ffffff;background-color:#4874cb;border-color:#ffffff;border-radius: 40rpx;height: 60rpx;display: flex;align-items: center;justify-content: center;">提交绑定</button>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view v-if="bindCompNewShow">
					<u--form labelPosition="left" :model="formBindComp">
						<u-form-item label="政采网账号" prop="formBindComp.supplierAccessName" borderBottom labelWidth='200'>
							<u--input v-model="formBindComp.supplierAccessName" border="none"></u--input>
						</u-form-item>
						<u-form-item label="职位" prop="formBindComp.post" borderBottom labelWidth='200'>
							<uni-data-select v-model="formBindComp.post" :localdata="postList"
								placeholder="选择职位"></uni-data-select>
						</u-form-item>
					</u--form>

					<!-- <u-button type="success">提交</u-button> -->
					<button size="default" type="default" @click="submitBindComp"
						style="margin-top: 40rpx;color:#ffffff;background-color:#4874cb;border-color:#ffffff;border-radius: 40rpx;height: 60rpx;display: flex;align-items: center;justify-content: center;">提交绑定</button>
				</view>

			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {
		getFieldList,
		postBindEnterprise,
		getUserBindComp,
		getUserHaveBindComp,
	} from "@/api/user.js";
	export default {
		name: 'BindComp',
		props: {
			bindCompShow: {
				type: Boolean,
				default: true
			},
			userId: {
				type: String,
			},
			itemList: {
				type: Array,
				default: () => []
			}
		},
		computed: {
			...mapState("user", ["token", "tokenExpire", "userInfo"]),
			localBindCompShow: {
				get() {
					return this.bindCompShow;
				},
				set(val) {
					this.$emit('update:bindCompShow', val)
				}
			},
			itemsToDisplay() {
				let list = this.itemList.length > 0 ? this.itemList : this.supplierList;
				// 处理 list，添加 post 和 isShow 属性
				let processedList = list.map(item => ({
				    ...item,
				    post: item.post !== undefined ? item.post : '', // 添加 post 属性，保留原值或默认值为空字符串
				    isShow: item.isShow !== undefined ? item.isShow : true // 添加 isShow 属性，默认值为 true
				}));
				return processedList;		
			}
		},
		data() {
			return {
				supplierList: [],
				bindCompNewShow: false,
				bindCompTabList: [{
						name: '政采企业信息绑定',
					},
					{
						name: '绑定其他企业',
					}
				],
				postList: [],
				formBindComp: {
					supplierAccessName: '',
					post: '',
					userId: '',
				}
			};
		},
		mounted() {
			this.fieldListGet();
			if (this.userInfo.id != undefined) {
				this.userBindCompGet();
			}
		},
		created() {
			
		},
		methods: {
			...mapMutations("user", ["setUserInfo"]),
			async submitBindComp() {
				this.formBindComp.userId = this.userId
				if (!this.formBindComp.userId) {
					this.formBindComp.userId = this.userInfo.id
				}

				if (this.formBindComp.userId == "") {
					uni.$u.toast('绑定失败，请尝试重新登陆后绑定！');
					return;
				}
				if (this.formBindComp.supplierAccessName === "") {
					uni.$u.toast('政采网账号不能为空！');
					return;
				}
				if (this.formBindComp.post === "") {
					uni.$u.toast('职位信息不能为空！');
					return;
				}
				const {
					code,
					msg,
					data
				} = await postBindEnterprise(this.formBindComp);

				if (code === 0) {
					// console.log(data)
					uni.$u.toast('绑定企业成功！');
					setTimeout(() => {
						this.$emit('close-popup');
						uni.reLaunch({
							url: '/pages/index/index'
						});
					}, 1000);
				}

			},
			async submitBindCompCard(item) {
				if (item.post === undefined || item.post === "") {
					uni.$u.toast('企业职位不能为空！');
					return;
				}
				let userID = this.userId;
				if (!userID) {
					userID = this.userInfo.id
				}

				const params = {
					supplierAccessName: item.supplierAccessName,
					post: item.post,
					userId: userID,
				}
				console.log(params)
				const {
					code,
					msg,
					data
				} = await postBindEnterprise(params);
				if (code === 0) {
					// console.log(data)
					// 更新 item 的 isShow 属性
					this.$set(item, 'isShow', false);
					uni.$u.toast('绑定' + item.companyName + '成功！');
					// 更新绑定企业
					this.userBindCompGet();

				}
			},
			onClickOverlayClose() {
				this.$emit('close-popup');
			},
			//获取用户下面的政采企业信息
			async userBindCompGet() {
				try {
					// 如果resBindComp里面包含resHaveBind的数据,那么就设置该企业已经绑定好了
					const resHaveBind = await getUserHaveBindComp();
					const resBindComp = await getUserBindComp();
					if (resHaveBind.code === 0 && resBindComp.code === 0) {

						const haveBindMap = new Map();
						resHaveBind.data.forEach(item => {
							haveBindMap.set(item.supplierId, item.post);
						});

						this.supplierList = resBindComp.data.map(item => {
							if (haveBindMap.has(item.supplierId)) {
								return {
									...item,
									post: haveBindMap.get(item.supplierId),
									isShow: false
								};
							}
							return item;
						});

						console.log(this.supplierList);
					}
				} catch (error) {
					console.error('获取用户绑定企业信息失败', error);
				}

			},
			//获取职位信息
			async fieldListGet() {
				const {
					code,
					msg,
					data
				} = await getFieldList({
					fieldName: "register_post"
				});
				if (code === 0 && data) {
					// console.log(data)
					this.postList = data.map(post => {
						return {
							value: post.dictCode,
							text: post.dictName
						}
					});
					// console.log(this.postList)
				}
			},
			getPostText(postValue) {
				const postItem = this.postList.find(post => post.value === postValue);
				// console.log(postValue, postItem)
				return postItem ? postItem.text : '未知职位';
			},
			selectTab(item) {
				// console.log(item.name)
				if (item.name == "绑定其他企业") {
					this.bindCompNewShow = true;
				} else {
					this.bindCompNewShow = false;
				}
			},
		},
	}
</script>

<style scoped lang="less">
	.bindCompCard {
		width: 650rpx;
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.header-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		margin-bottom: 20rpx;
	}

	.header-button {
		position: absolute;
		width: 80rpx;
		top: 0;
		right: 5px;
		margin: 10rpx;
	}

	.header-text {
		font-size: 36rpx;
		margin-bottom: 10rpx;
		text-align: center;
		width: 100%;
	}

	.tabs {
		width: 100%;
	}

	// ------------------------
	.supplier-container {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		padding: 20rpx;
		height: 600rpx;
		overflow: auto;
	}

	.supplier-card {
		background: #fff;
		border-radius: 10rpx;
		box-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.1);
		padding: 20rpx;
		display: flex;
		// flex-direction: column;
		gap: 10rpx;
	}

	.supplier-details {
		margin-top: 27rpx;
		width: 360rpx;
		display: flex;
		flex-direction: column;
		gap: 10rpx;
	}

	.company-name,
	.supplier-name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
	}

	.company-name {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.supplier-name {
		font-size: 32rpx;
		color: #666;
	}

	.post-select {
		margin-top: 10rpx;
		width: 222rpx;
	}

	.bind-button {
		margin-left: 10rpx;
	}
</style>
```

