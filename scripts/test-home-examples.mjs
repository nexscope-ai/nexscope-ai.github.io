import test from 'node:test';
import assert from 'node:assert/strict';
import { projectHomeExamples } from './refresh-home-examples.mjs';

const asset = 'https://store.nexscope.ai/prod/marketing-video-example/';
const example = (title, id) => ({
  title,
  workflowType: 'IMAGE_TO_VIDEO',
  coverImageUrl: `${asset}image/${id}.jpg`,
  previewVideoUrl: `${asset}video/${id}.mp4`,
  sourceImageUrl: `${asset}image/source.jpg`,
  durationSeconds: 10,
  aspectRatio: '9:16',
  config: { private: 'must not export' },
});

test('projects only public media fields and prioritizes the three selected examples', () => {
  const output = projectHomeExamples({
    code: 0,
    data: {
      records: [
        example('Other', 1),
        example('A Happy Mealtime', 2),
        example('Poolside Sunglasses', 3),
        example('A Little Care, Every Day', 4),
      ],
    },
  });
  assert.deepEqual(
    output.map((item) => item.title),
    ['Poolside Sunglasses', 'A Happy Mealtime', 'A Little Care, Every Day'],
  );
  assert.equal(output[0].duration, 10);
  assert.equal('config' in output[0], false);
});

test('rejects test hosts, signed URLs and non-video media; deduplicates clips', () => {
  const valid = example('Valid', 1);
  assert.equal(
    projectHomeExamples({
      code: 0,
      data: [
        valid,
        valid,
        { ...valid, previewVideoUrl: 'https://test.example.com/video.mp4' },
        { ...valid, previewVideoUrl: `${valid.previewVideoUrl}?token=secret` },
        { ...valid, previewVideoUrl: `${asset}video/script.js` },
        { ...valid, workflowType: 'AVATAR_VIDEO' },
      ],
    }).length,
    1,
  );
  assert.throws(() => projectHomeExamples({ code: 500, data: [] }));
  assert.throws(() => projectHomeExamples({ code: 0, data: {} }));
});
