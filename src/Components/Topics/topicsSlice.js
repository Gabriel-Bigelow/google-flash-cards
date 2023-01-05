import { createSlice } from "@reduxjs/toolkit";
import { parseFromGoogle } from "../../util/parseSavedData";


const topicsSlice = createSlice({
    name: 'topics',
    initialState: {
        topics: {}
    },
    reducers: {
        parseTopicsFromGoogle: (state, action) => {
            const parsedData = parseFromGoogle(action.payload.body.content);
            state.topics = parsedData.topics;
        },
        addTopic: (state, action) => {
            state.topics[action.payload.id] = {
                id: action.payload.id,
                name: action.payload.name,
                image: action.payload.image,
                quizIds: []
            }
        },
        removeTopic: (state, action) => {
            state.topics = {};

            for (let topic of action.payload) {
                state.topics[topic.id] = topic;
            }
        },
        addQuizId: (state, action) => {
            state.topics[action.payload.topicId].quizIds.push(action.payload.quizId);
        }
    }
})

export const { parseTopicsFromGoogle, addTopic, removeTopic, addQuizId } = topicsSlice.actions;
export const selectTopics = (state) => state.topics.topics;
export default topicsSlice.reducer;