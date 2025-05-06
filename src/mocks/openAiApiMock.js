// src/mocks/openAiApiMock.js
import {jest} from "@jest/globals";

const mockImageUrl = jest.fn(() => 'mocked-image-url');
export const GenerateImageMock = jest.fn().mockResolvedValue(mockImageUrl);