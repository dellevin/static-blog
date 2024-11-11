给你两个整数数组 `nums1` 和 `nums2` ，请你以数组形式返回两数组的交集。返回结果中每个元素出现的次数，应与元素在两个数组中都出现的次数一致（如果出现次数不一致，则考虑取较小值）。可以不考虑输出结果的顺序。

  

**示例 1：**

  
```bash

输入：nums1 = [1,2,2,1], nums2 = [2,2]

输出：[2,2]

```

  

**示例 2:**

  

```bash

输入：nums1 = [4,9,5], nums2 = [9,4,9,8,4]

输出：[4,9]

```

  

  

**提示：**

  

- `1 <= nums1.length, nums2.length <= 1000`

- `0 <= nums1[i], nums2[i] <= 1000`

  

**代码:**

  

```java
class Solution {
    public int[] intersect(int[] nums1, int[] nums2) {
        int len1=nums1.length;
        int len2=nums2.length;
        int len = len1<len2?len1:len2;
        int[] mark =new int[len];
        //排好序
        Arrays.sort(nums1);
        Arrays.sort(nums2);
        int i=0,j=0,k=0;

        while(i<len1 && j<len2){
            if(nums1[i] == nums2[j]){
                //相等的时候赋值
                mark[k] = nums2[j];
                k++;
                i++;
                j++;
            }else if(nums1[i] < nums2[j]){
                //如果nums[i]小于nums2[j]i需要右移,左边肯定更小了
                i++;
            }else{
                //反之j就右移动
                j++;
            }
        }
        return Arrays.copyOfRange(mark,0,k);
    }
}


```

  

**思路:**

  

对两个数组进行排序，然后使用两个指针，分别指向两个数组开始的位置。

  

如果两个指针指向的值相同，说明这个值是他们的交集，就把这个值加入到集合list中，然后两个指针在分别往后移一步。

如果两个指针指向的值不同，那么指向的值相对小的往后移一步，相对大的先不动，然后再比较。