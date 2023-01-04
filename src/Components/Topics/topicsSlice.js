import { createSlice } from "@reduxjs/toolkit";


const topicsSlice = createSlice({
    name: 'topics',
    initialState: {
        topics: {}
    },
    reducers: {
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
            console.log(action.payload);
            state.topics[action.payload.topicId].quizIds.push(action.payload.quizId);
        }
    }
})

export const { addTopic, removeTopic, addQuizId } = topicsSlice.actions;
export const selectTopics = (state) => state.topics.topics;
export default topicsSlice.reducer;