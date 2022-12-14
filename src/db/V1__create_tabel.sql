CREATE SCHEMA IF NOT EXISTS spec;

CREATE TABLE IF NOT EXISTS spec.event (
  pid        INT       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  is_deleted BOOLEAN   DEFAULT FALSE,
  event_by   INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  event_name VARCHAR UNIQUE,
  event_data JSON
);

CREATE TABLE IF NOT EXISTS spec.dataset (
  pid          INT       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  is_deleted BOOLEAN   DEFAULT FALSE,
  event_by   INT NOT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  dataset_name VARCHAR UNIQUE,
  dataset_data JSON
);

CREATE TABLE IF NOT EXISTS spec.dimension (
  pid            INT       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  is_deleted BOOLEAN   DEFAULT FALSE,
  event_by   INT NOT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  dimension_name VARCHAR UNIQUE,
  dimension_data JSON
);

CREATE TABLE IF NOT EXISTS spec.transformer (
  pid                  INT       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  is_deleted BOOLEAN   DEFAULT FALSE,
  event_by   INT NOT NULL,
  created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  transformer_file     VARCHAR,
  transformer_function VARCHAR,
  UNIQUE (transformer_file, transformer_function)
);

CREATE TABLE IF NOT EXISTS spec.pipeline (
  pid             INT       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  is_deleted BOOLEAN   DEFAULT FALSE,
  event_by   INT NOT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  pipeline_name   VARCHAR UNIQUE,
  event_pid       INT NOT NULL REFERENCES spec.event (pid),
  dataset_pid     INT NOT NULL REFERENCES spec.dataset (pid),
  dimension_pid   INT NOT NULL REFERENCES spec.dimension (pid),
  transformer_pid INT NOT NULL REFERENCES spec.transformer (pid)
);

CREATE SCHEMA IF NOT EXISTS ingestion;

CREATE TABLE IF NOT EXISTS ingestion.student_count_by_school_and_grade (
  pid           INT       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  is_deleted BOOLEAN   DEFAULT FALSE,
  event_by   INT NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  school_id     VARCHAR,
  grade         INTEGER,
  student_count INTEGER
);

INSERT INTO spec.event (
  event_name, event_data)
VALUES ('student_count', '{
  "ingestion_type": "event",
  "input": {
    "type": "object",
    "properties": {
      "event_name": {
        "type": "string"
      },
      "event": {
        "type": "object",
        "properties": {
          "school_id": {
            "type": "string"
          },
          "grade": {
            "type": "string"
          },
          "count": {
            "type": "string"
          }
        },
        "required": [
          "school_id",
          "grade",
          "count"
        ]
      }
    },
    "required": [
      "event_name",
      "event"
    ]
  }
}');

INSERT INTO spec.dataset (dataset_name, dataset_data)
VALUES ('student_count_by_school_and_grade', '{
  "ingestion_type": "dataset",
  "input": {
    "type": "object",
    "properties": {
      "dataset_name": {
        "type": "string"
      },
      "dataset": {
        "type": "object",
        "properties": {
          "school_id": {
            "type": "string"
          },
          "grade": {
            "type": "string"
          },
          "student_count": {
            "type": "string"
          }
        },
        "required": [
          "school_id",
          "grade",
          "student_count"
        ]
      }
    },
    "required": [
      "dataset_name",
      "dataset"
    ]
  }
}');

INSERT INTO spec.dimension (dimension_name, dimension_data)
VALUES ('district', '{
  "ingestion_type": "dimension",
  "input": {
    "type": "object",
    "properties": {
      "dimension_name": {
        "type": "string"
      },
      "dimension": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "district_id": {
            "type": "string"
          }
        },
        "required": [
          "name",
          "district_id"
        ]
      }
    },
    "required": [
      "dimension_name",
      "dimension"
    ]
  }
}');

INSERT INTO spec.dimension (dimension_name, dimension_data)
VALUES ('district', '{
  "ingestion_type": "dimension",
  "input": {
    "type": "object",
    "properties": {
      "dimension_name": {
        "type": "string"
      },
      "dimension": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "district_id": {
            "type": "string"
          }
        },
        "required": [
          "name",
          "district_id"
        ]
      }
    },
    "required": [
      "dimension_name",
      "dimension"
    ]
  }
}');

INSERT INTO spec.transformer (
  transformer_file, transformer_function)
VALUES ('sum_transformer.py', 'studCount');

INSERT INTO spec.pipeline (
  event_pid, dataset_pid, dimension_pid, transformer_pid)
VALUES (1, 1, 1, 1);