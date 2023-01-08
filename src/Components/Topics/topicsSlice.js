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
            const quizIds = state.topics[action.payload.id] ? state.topics[action.payload.id].quizIds : [];
            state.topics[action.payload.id] = {
                id: action.payload.id,
                name: action.payload.name,
                image: action.payload.image,
                quizIds: quizIds
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
        },
        removeQuizId: (state, action) => {
            if (state.topics[action.payload.topicId] !== undefined) {
                state.topics[action.payload.topicId].quizIds = state.topics[action.payload.topicId].quizIds.filter(topic => topic !== parseInt(action.payload.removeId));
            }
        }
    }
})

export const { parseTopicsFromGoogle, addTopic, removeTopic, addQuizId, removeQuizId } = topicsSlice.actions;
export const selectTopics = (state) => state.topics.topics;
export default topicsSlice.reducer;