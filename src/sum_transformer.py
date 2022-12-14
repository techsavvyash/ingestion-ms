from flask import Flask,request
import configparser
import os
import psycopg2
import pandas as pd

app = Flask(__name__)

configuartion_path = os.path.dirname(os.path.abspath(__file__)) + "/config.ini"
print(configuartion_path)
config = configparser.ConfigParser()
config.read(configuartion_path);

port = config['CREDs']['port']
host = config['CREDs']['host']
user = config['CREDs']['user']
password = config['CREDs']['password']
database = config['CREDs']['database']

con = psycopg2.connect(database=database, user=user, password=password, host=host, port=port)
cur = con.cursor()

def studCount(valueCols=['school_id', 'grade', 'student_count']):

    df_events = pd.read_csv('/home/ramya/CQube/INPUTS/student_count.csv')
    df_calc = df_events.groupby(['school_id', 'grade'], as_index=False).agg({'student_count': 'sum'})
    df_calc = df_calc[valueCols]

    try:
         for index,row in df_calc.iterrows():
            values = []
            for i in valueCols:
              values.append(row[i])
            query = ''' INSERT INTO ingestion.student_count_by_school_and_grade(school_id,grade,student_count) VALUES ({}) ON CONFLICT (school_id,grade) DO UPDATE SET student_count=excluded.student_count;'''\
            .format(','.join(map(str,values)))
            cur.execute(query)
            con.commit()
    except Exception as error:
        print(error)
    finally:
        if cur is not None:
            cur.close()
        if con is not None:
            con.close()
    return  
stud_atte()



