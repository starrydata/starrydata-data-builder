# -*- coding: utf-8 -*-
import click
import logging
from pathlib import Path
import pandas as pd
from tqdm import tqdm
import numpy as np
from bokeh.plotting import figure, output_file, save
from bokeh.layouts import column
from bokeh.models import ColumnDataSource, HoverTool, Label, Div
from bokeh.io import export_png
from bs4 import BeautifulSoup
import datetime


@click.command()
@click.argument('input_filepath', type=click.Path(exists=True))
@click.argument('output_filepath', type=click.Path())
def main(input_filepath, output_filepath):
    """ Runs data processing scripts to turn raw data from (../raw) into
        cleaned data ready to be analyzed (saved in ../processed).
    """
    logger = logging.getLogger(__name__)
    logger.info('making final data set from raw data')
    df = pd.read_csv(input_filepath)
    def convert_string_to_list(string_value):
        try:
            return eval(string_value)
        except Exception as e:
            print(string_value)
            print(e)

    df['y'] = df['y'].apply(convert_string_to_list)
    df['x'] = df['x'].apply(convert_string_to_list)
    df = df.explode(['x', 'y']).reset_index(drop=True)
    for prop, count in df['prop_x'].value_counts(normalize=False).items():
        df.loc[df['prop_x'] == prop, prop] = pd.to_numeric(df['x'])

    for prop, count in df['prop_y'].value_counts(normalize=False).items():
        df.loc[df['prop_y'] == prop, prop] = pd.to_numeric(df['y'])
    df["figure_id"] = df["figure_id"].apply(str)
    df["SID"] = df["SID"].apply(str)
    df["sample_id"] = df["sample_id"].apply(str)
    df_fp = df.groupby(['prop_x', 'prop_y']).agg({'unit_x': 'first', 'unit_y': 'first'}).reset_index()

    soup = BeautifulSoup("<html><head><title>Curve example</title></head><body><h1>Curve examples</h1></body></html>", "html.parser")
    ul_tag = soup.new_tag("ul")

    for index, row in df_fp.iterrows():
        print(f'generate figures: {index}/{df_fp.shape[0]}')
        prop_x = row['prop_x']
        prop_y = row['prop_y']
        unit_x = row['unit_x']
        unit_y = row['unit_y']
        label_x = f'{prop_x} ({unit_x})'
        label_y = f'{prop_y} ({unit_y})'

        selected_df = df[(df[prop_x].notnull()) & (df[prop_y].notnull())]

        source = ColumnDataSource(data=dict(
            x=selected_df[prop_x].values,
            y=selected_df[prop_y].values,
            SID=selected_df['SID'],
            figure_id=selected_df['figure_id'],
            sample_id=selected_df['sample_id'],
            composition=selected_df['composition']
        ))
        if prop_x == prop_y:
            continue

        p = figure(title=f'{prop_x} vs. {prop_y}', x_axis_label=label_x, y_axis_label=label_y, x_axis_type='log', y_axis_type='log')

        p.scatter('x', 'y', source=source, alpha=0.2)

        file_name = f'{prop_x}-{prop_y}'
        hover = HoverTool(tooltips=[('SID', '@SID'), ('Figure ID', '@figure_id'), ('Sample ID', '@sample_id'), ('composition', '@composition')])
        p.add_tools(hover)

        file_path = output_filepath + file_name + '.html'  # ファイルパスを変数に格納

        output_file(filename=file_path)
        save(p)

        # HTMLファイルを開いて作成日時を追加
        with open(file_path, 'a') as f:
            created_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            f.write(f"<footer>Date created: {created_date}</footer>")

        li_tag = soup.new_tag("li")
        a_tag = soup.new_tag("a")

        a_tag.string = f'{prop_x}-{prop_y}'
        a_tag['href'] = f'./{prop_x}-{prop_y}.html'
        li_tag.append(a_tag)
        ul_tag.append(li_tag)

    body_tag = soup.body
    body_tag.append(ul_tag)

    # 作成日時を追加: footer要素を作成して、作成日時の日付を埋め込む
    created_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    footer_tag = soup.new_tag("footer")
    footer_tag.string = f"Date created: {created_date}"
    soup.body.append(footer_tag)

    # HTML文字列をファイルに書き込み
    html_string = soup.prettify(formatter=None)
    with open(output_filepath + 'index.html', 'w') as file:
        file.write(html_string)


if __name__ == '__main__':
    log_fmt = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    logging.basicConfig(level=logging.INFO, format=log_fmt)

    project_dir = Path(__file__).resolve().parents[2]

    main()
