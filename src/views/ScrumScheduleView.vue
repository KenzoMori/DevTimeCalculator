<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AbsentMark from '@/components/AbsentMark.vue'

const MAX_MEMBERS = 9
const DEV_HOURS_PER_LINE = 7.5
const MAX_LINES = 4
const MAX_HOURS = DEV_HOURS_PER_LINE * MAX_LINES
const HOURS_FOR_RELEASE_TASKS = 1

const willPerformReleaseTasks = ref(false)
const numOfMembersFullDayOff = ref(0)

type Schedule = {
  time: string
  numOfAbsentees: number | null
  willAllocateToEvent: boolean
  willAllocateToBreak: boolean
}
const scheduleList = ref<Schedule[]>([
  {
    time: '9:30',
    numOfAbsentees: null,
    willAllocateToEvent: true,
    willAllocateToBreak: false,
  }, // 朝会
  {
    time: '9:45',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '10:00',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '10:15',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '10:30',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '10:45',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '11:00',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '11:15',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '11:30',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '11:45',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '12:00',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '12:15',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    // 昼休み
    time: '12:30',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: true,
  },
  {
    // 昼休み
    time: '12:45',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: true,
  },
  {
    // 昼休み
    time: '13:00',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: true,
  },
  {
    // 昼休み
    time: '13:15',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: true,
  },
  {
    time: '13:30',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '13:45',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '14:00',
    numOfAbsentees: null,
    willAllocateToEvent: true,
    willAllocateToBreak: false,
  }, // 昼会
  {
    time: '14:15',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '14:30',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '14:45',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '15:00',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '15:15',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '15:30',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '15:45',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '16:00',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '16:15',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '16:30',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '16:45',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '17:00',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '17:15',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '17:30',
    numOfAbsentees: null,
    willAllocateToEvent: false,
    willAllocateToBreak: false,
  },
  {
    time: '17:45',
    numOfAbsentees: null,
    willAllocateToEvent: true,
    willAllocateToBreak: false,
  }, // 夕会
])

/**
 * ライン数
 * 1ラインは2名構成を想定
 * ただし、ライン数は最大4
 * @param numOfAbsentees 欠席者数
 */
const lines = (numOfAbsentees: number | null) => {
  if (numOfAbsentees === null) return null
  return Math.min(Math.floor((MAX_MEMBERS - numOfAbsentees) / 2), MAX_LINES)
}
/**
 * 減るライン数
 * @param numOfAbsentees 欠席者数
 */
const reducedLines = (numOfAbsentees: number | null) => {
  if (numOfAbsentees === null) return null
  const numOfLines: number | null = lines(numOfAbsentees)
  if (numOfLines === null) return null
  return numOfLines - MAX_LINES
}
/**
 * 減る時間
 * 1ラインあたり0.25時間
 * @param numOfAbsentees 欠席者数
 */
const reducedHours = (numOfAbsentees: number | null) => {
  if (numOfAbsentees === null) return 0
  const numOfReducedLines: number | null = reducedLines(numOfAbsentees)
  if (numOfReducedLines === null) return 0
  return numOfReducedLines * 0.25
}
/**
 * 参加者数
 * @param schedule
 */
function numOfAttendees(schedule: Schedule) {
  if (schedule.numOfAbsentees !== null)
    return MAX_MEMBERS - schedule.numOfAbsentees
}
/**
 * 欠席者数を増減
 * @param schedule
 */
function increase(schedule: Schedule) {
  if (schedule.numOfAbsentees !== null && schedule.numOfAbsentees < MAX_MEMBERS)
    schedule.numOfAbsentees++
}
function decrease(schedule: Schedule) {
  if (schedule.numOfAbsentees !== null && schedule.numOfAbsentees > 0)
    schedule.numOfAbsentees--
}
/**
 * 減る時間数の合計
 * ただし、リリースタスクを行う場合はその分も減らす
 */
const sumOfReduceHours = computed(() => {
  const value =
    scheduleList.value
      .filter(schedule => schedule.numOfAbsentees !== null)
      .reduce(
        (acc, schedule) => acc + reducedHours(schedule.numOfAbsentees),
        0,
      ) - (willPerformReleaseTasks.value ? HOURS_FOR_RELEASE_TASKS : 0)
  console.log('sumOfReduceHours=', value)
  return value
})
/**
 * イベントに割り当てるか否かをスイッチする
 * @param schedule
 */
function toggleEventAllocation(schedule: Schedule) {
  schedule.willAllocateToEvent = !schedule.willAllocateToEvent
}
/**
 * 休憩に割り当てるか否かをスイッチする
 * @param schedule
 */
function toggleBreakAllocation(schedule: Schedule) {
  schedule.willAllocateToBreak = !schedule.willAllocateToBreak
}
/**
 * イベントに割り当てる場合、欠席人数を全員とする
 * イベントを解除する場合、欠席人数を全休メンバー数にリセットする
 */
watch(
  // 監視対象は scheduleList そのものではなく、そこから取得した willAllocateToEvent の配列
  // そのため、scheduleList が変更されても watch は実行されない（無限再帰が発生しない）
  () => scheduleList.value.map(schedule => schedule.willAllocateToEvent),
  (newValues, oldValues) => {
    console.log('newValues', newValues)
    console.log('oldValues', oldValues)
    newValues.forEach((newValue, index) => {
      // undefined or false -> true に変更された場合
      // (初期表示の場合 oldValues がないため undefined となる)
      if ((!oldValues || !oldValues[index]) && newValue) {
        scheduleList.value[index].willAllocateToBreak = false
        scheduleList.value[index].numOfAbsentees = MAX_MEMBERS
      }
      // undefined or true -> false に変更された場合
      else if ((!oldValues || (oldValues && oldValues[index])) && !newValue) {
        if (!scheduleList.value[index].willAllocateToBreak) {
          scheduleList.value[index].numOfAbsentees =
            numOfMembersFullDayOff.value
        }
      }
    })
  },
  // 初期表示の際にも実行されるように immediate: true を指定
  { deep: true, immediate: true },
)
/**
 * 休憩に割り当てる場合、開発可能時間計算対象外とするため欠席者数をnullにする
 * 休憩を解除する場合、欠席人数を全休メンバー数にリセットする
 */
watch(
  () => scheduleList.value.map(schedule => schedule.willAllocateToBreak),
  (newValues, oldValues) => {
    console.log('newValues', newValues)
    console.log('oldValues', oldValues)
    newValues.forEach((newValue, index) => {
      // undefined or false > true に変更された場合
      // (初期表示の場合 oldValues がないため undefined となる)
      if ((!oldValues || !oldValues[index]) && newValue) {
        scheduleList.value[index].willAllocateToEvent = false
        scheduleList.value[index].numOfAbsentees = null
      }
      // undefined or true > false に変更された場合
      else if ((!oldValues || (oldValues && oldValues[index])) && !newValue) {
        if (!scheduleList.value[index].willAllocateToEvent) {
          scheduleList.value[index].numOfAbsentees =
            numOfMembersFullDayOff.value
        }
      }
    })
  },
)
/**
 * 全休メンバー数を各時間の欠席者数に反映
 * ただし、イベントや休憩に割り当てられている場合は反映しない
 */
watch(
  () => numOfMembersFullDayOff.value,
  (newValue, oldValue) => {
    console.log('newValue', newValue)
    console.log('oldValue', oldValue)

    scheduleList.value.forEach(schedule => {
      if (!schedule.willAllocateToBreak && !schedule.willAllocateToEvent) {
        const result = schedule.numOfAbsentees! + (newValue - oldValue)
        if (result >= 0 && result <= MAX_MEMBERS) {
          schedule.numOfAbsentees =
            schedule.numOfAbsentees! + (newValue - oldValue)
        }
      }
    })
  },
)
</script>

<template>
  <div class="wrapper">
    <aside>
      <h3>Scrum Schedule for a day</h3>
      <h4>members</h4>
      <p>{{ MAX_MEMBERS }}</p>
      <h4>max lines</h4>
      <p>{{ MAX_LINES }}</p>
      <h4>development hours per line</h4>
      <p>{{ DEV_HOURS_PER_LINE }} h</p>
      <h4>max hours</h4>
      <p title="">{{ MAX_HOURS }} h</p>
      <h4>reduced hours (total)</h4>
      <p>{{ sumOfReduceHours }} h</p>
      <h4>devlopment time</h4>
      <p style="color: red">{{ MAX_HOURS + sumOfReduceHours }} h</p>
    </aside>
    <main>
      <table>
        <thead>
          <tr>
            <th colspan="8" style="text-align: left">
              <input
                type="checkbox"
                id="releaseTasks"
                v-model="willPerformReleaseTasks"
              />
              <label for="releaseTasks" style="padding-left: 8px">
                We will perform release tasks today. (reduce
                {{ HOURS_FOR_RELEASE_TASKS }} hour)
              </label>
            </th>
          </tr>
          <tr>
            <th colspan="8" style="text-align: left">
              <label for="numOfMembersFullDayOff"
                >Number of full day off members:
              </label>
              <input
                id="numOfMembersFullDayOff"
                type="number"
                min="0"
                max="9"
                style="width: 40px; margin-left: 8px; padding-left: 4px"
                v-model="numOfMembersFullDayOff"
              />
            </th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th colspan="1">absentees</th>
            <th></th>
            <th>reduced lines</th>
            <th>reduced hours</th>
            <th>attendees</th>
            <th>lines</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="schedule in scheduleList"
            :key="schedule.time"
            :class="{
              'event-row': schedule.willAllocateToEvent,
              'break-row': schedule.willAllocateToBreak,
            }"
          >
            <td :id="`col_event_break_${schedule.time}`">
              <input
                type="checkbox"
                :id="`chkEvent_${schedule.time}`"
                v-model="schedule.willAllocateToEvent"
                @click="toggleEventAllocation(schedule)"
              />
              <label
                :for="`chkEvent_${schedule.time}`"
                :class="{ 'highlight-toggle': schedule.willAllocateToEvent }"
                >Event
              </label>
              <input
                type="checkbox"
                :id="`chkBreak_${schedule.time}`"
                v-model="schedule.willAllocateToBreak"
                @click="toggleBreakAllocation(schedule)"
              />
              <label
                :for="`chkBreak_${schedule.time}`"
                :class="{ 'highlight-toggle': schedule.willAllocateToBreak }"
                >Break</label
              >
            </td>
            <td :id="`col_time_${schedule.time}`">
              {{ schedule.time }}
            </td>
            <td :id="`col_num_of_absentees_${schedule.time}`">
              <AbsentMark :numOfAbsentees="schedule.numOfAbsentees" />
              {{ schedule.numOfAbsentees }}
            </td>
            <td :id="`col_adjust_absentees_${schedule.time}`">
              <button
                @click="increase(schedule)"
                :disabled="
                  schedule.willAllocateToEvent || schedule.willAllocateToBreak
                "
              >
                ＋
              </button>
              <button
                @click="decrease(schedule)"
                :disabled="
                  schedule.willAllocateToEvent || schedule.willAllocateToBreak
                "
              >
                ー
              </button>
            </td>
            <td :id="`col_num_of_decreasing_lines_${schedule.time}`">
              ({{ reducedLines(schedule.numOfAbsentees) }})
            </td>
            <td :id="`col_decreasing_time_${schedule.time}`">
              ({{ reducedHours(schedule.numOfAbsentees) }})
            </td>
            <td :id="`col_num_of_attendees_${schedule.time}`">
              {{ numOfAttendees(schedule) }}
            </td>
            <td :id="`col_num_of_lines_${schedule.time}`">
              {{ lines(schedule.numOfAbsentees) }}
            </td>
          </tr>
          <tr></tr>
        </tbody>
      </table>
    </main>
  </div>
</template>

<style scoped>
.wrapper {
  margin-top: 16px;
  max-height: 85vh;
  display: flex;
  /* justify-content: center; */
}
aside {
  text-align: left;
  margin-bottom: 16px;
  line-height: normal;
  h3 {
    font-size: 24px;
    margin: 0px;
  }
  h4 {
    font-size: 16px;
    margin-top: 16px;
  }
  p {
    font-weight: bold;
  }
}
main {
  margin-left: 16px;
  overflow: auto;
}
table {
  border-collapse: collapse;
  font-size: 24px;
  line-height: 24px;
  width: 100%;
  table-layout: fixed;
  @media (prefers-color-scheme: light) {
    thead {
      background-color: rgb(240, 240, 240);
    }
  }
  @media (prefers-color-scheme: dark) {
    thead {
      background-color: #333;
    }
  }
  thead {
    position: sticky;
    top: 0;
    z-index: 1;

    line-height: normal;
    tr {
      display: table;
      width: 100%;
      table-layout: fixed;
    }
    th {
      font-size: 16px;
      padding: 4px;
      width: 80px;
      text-align: center;
    }
  }
  tbody {
    max-height: 70vh;
    overflow-y: auto;
    tr {
      display: table;
      width: 100%;
      table-layout: fixed;
    }
  }
  tr {
    border: 1px solid #ddd;
  }
  td {
    border: 0px solid;
    padding: 8px 8px;
    /* width: 30px; */
    text-align: right;
    vertical-align: middle;
  }

  [id*='col_event_break'] {
    min-width: 112px;
    width: 112px;
    text-align: center;
    /* background-color: white; */
    display: flex;
    padding: 0px;
    /* チェックボックスを非表示 */
    input[type='checkbox'] {
      display: none;
    }
    label {
      font-size: 16px;
      text-align: center;
      cursor: pointer;
      margin: auto;
      padding: 4px;
      border: 1px solid #ddd;
      border-radius: 12px;
      justify-content: center;
      align-items: center;
    }
    label:hover {
      font-weight: bold;
    }
  }
  [id*='col_time'] {
    min-width: 80px;
    width: 80px;
    text-align: right;
  }
  [id*='col_num_of_absentees'] {
    min-width: 143px;
    width: 143px;
    text-align: right;
  }
  [id*='col_adjust_absentees'] {
    min-width: 104px;
    text-align: center;
    /* cursor: pointer; */
    display: flex;
    justify-content: center;
    align-items: center;
    button {
      min-width: 20px;
      font-size: 16px;
      margin: 0px 4px;
      padding: 0px 4px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
  }
  [id*='col_num_of_decreasing_lines'] {
    min-width: 64px;
    text-align: right;
  }
  [id*='col_decreasing_time'] {
    min-width: 104px;
    text-align: right;
  }
  [id*='col_num_of_attendees'] {
    min-width: 104px;
    text-align: right;
  }
  [id*='col_num_of_lines'] {
    min-width: 104px;
    text-align: right;
  }
  .event-row {
    background-color: rgb(88, 177, 88);
    color: rgb(228, 227, 227);
    /* opacity: 0.8; */
  }
  .break-row {
    background-color: darkgray;
    color: rgb(228, 227, 227);
    /* opacity: 0.8; */
  }
  .highlight-toggle {
    background-color: yellow;
    color: black;
  }
}
/* button {
  font-size: 11px;
  margin: 2px 2px;
  padding: 2px 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
} */
button:not([disabled]):hover {
  cursor: pointer;
  background-color: aquamarine;
}
</style>
